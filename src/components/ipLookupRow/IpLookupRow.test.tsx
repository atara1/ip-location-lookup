import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IpLookupRow } from "./IpLookupRow";
import type { IpLookupRowModel } from "../../types";

const lookupMock = jest.fn();

jest.mock("../../hooks/useIpLookup/useIpLookup", () => ({
  useIpLookup: () => ({ lookup: lookupMock }),
}));

const useLocalTimeMock = jest.fn();
jest.mock("../../hooks/useLocalTime", () => ({
  useLocalTime: (tz: string | undefined) => useLocalTimeMock(tz),
}));

const validateIpv4Mock = jest.fn();
jest.mock("../../utils/ipValidation/ipValidation", () => ({
  validateIpv4: (value: string) => validateIpv4Mock(value),
}));

function makeRow(overrides?: Partial<IpLookupRowModel>): IpLookupRowModel {
  return {
    id: "row-1",
    ip: "",
    status: "idle",
    country: undefined,
    countryCode: undefined,
    timezone: undefined,
    error: undefined,
    ...overrides,
  } as IpLookupRowModel;
}

describe("IpLookupRow", () => {
  beforeEach(() => {
    lookupMock.mockReset();
    useLocalTimeMock.mockReset();
    validateIpv4Mock.mockReset();
    useLocalTimeMock.mockReturnValue("10:00");
  });

  it("renders index avatar and textbox", () => {
    render(
      <IpLookupRow
        row={makeRow()}
        index={0}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <IpLookupRow
        row={makeRow({ ip: "" })}
        index={0}
        onChange={onChange}
        onUpdate={jest.fn()}
      />
    );

    await user.type(screen.getByRole("textbox"), "8.8.8.8");
    expect(onChange).toHaveBeenCalled();
  });

  it("input is disabled when row.status is loading", () => {
    render(
      <IpLookupRow
        row={makeRow({ status: "loading", ip: "8.8.8.8" })}
        index={0}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  describe("onBlur", () => {
    it("invalid ip will sets error and does not call lookup", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpv4Mock.mockReturnValue({ ok: false, error: "Invalid IPv4" });

      render(
        <IpLookupRow
          row={makeRow({ ip: "bad" })}
          index={0}
          onChange={jest.fn()}
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(validateIpv4Mock).toHaveBeenCalledWith("bad");
      expect(onUpdate).toHaveBeenCalledWith({
        status: "error",
        error: "Invalid IPv4",
      });
      expect(lookupMock).not.toHaveBeenCalled();
    });

    it("valid ip will sets loading then success with lookup result", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpv4Mock.mockReturnValue({ ok: true, value: "8.8.8.8" });
      lookupMock.mockResolvedValue({
        country: "United States",
        countryCode: "US",
        timezone: "America/New_York",
      });

      render(
        <IpLookupRow
          row={makeRow({ ip: "8.8.8.8" })}
          index={0}
          onChange={jest.fn()}
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(onUpdate).toHaveBeenCalledWith({
        status: "loading",
        error: undefined,
      });

      await waitFor(() => {
        expect(lookupMock).toHaveBeenCalledWith("8.8.8.8");
      });

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith({
          status: "success",
          country: "United States",
          countryCode: "US",
          timezone: "America/New_York",
          error: undefined,
        });
      });
    });

    it("lookup throws Error will sets error with message", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpv4Mock.mockReturnValue({ ok: true, value: "8.8.8.8" });
      lookupMock.mockRejectedValue(new Error("Network error"));

      render(
        <IpLookupRow
          row={makeRow({ ip: "8.8.8.8" })}
          index={0}
          onChange={jest.fn()}
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(onUpdate).toHaveBeenCalledWith({
        status: "loading",
        error: undefined,
      });

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith({
          status: "error",
          error: "Network error",
        });
      });
    });

    it("lookup throws non-Error will sets generic error", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpv4Mock.mockReturnValue({ ok: true, value: "8.8.8.8" });
      lookupMock.mockRejectedValue("boom");

      render(
        <IpLookupRow
          row={makeRow({ ip: "8.8.8.8" })}
          index={0}
          onChange={jest.fn()}
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith({
          status: "error",
          error: "Something went wrong",
        });
      });
    });
  });

  it("renders error text when status is error", () => {
    render(
      <IpLookupRow
        row={makeRow({ status: "error", error: "Invalid IPv4" })}
        index={0}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Invalid IPv4")).toBeInTheDocument();
  });

  it("renders flag image and local time when status is success", () => {
    useLocalTimeMock.mockReturnValue("12:34");

    render(
      <IpLookupRow
        row={makeRow({
          status: "success",
          country: "United States",
          countryCode: "US",
          timezone: "America/New_York",
        })}
        index={0}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("12:34")).toBeInTheDocument();

    const img = screen.getByRole("img", { name: /flag/i });
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("https://flagcdn.com/24x18/us.png")
    );
  });

  it("renders loader box when status is loading", () => {
    render(
      <IpLookupRow
        row={makeRow({ status: "loading" })}
        index={0}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    const rightArea = screen.getByText("1").closest("div")?.parentElement;
    expect(rightArea).toBeTruthy();

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
});
