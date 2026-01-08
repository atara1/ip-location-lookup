import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IpLookupRow } from "./IpLookupRow";
import type { IpLookupRowModel } from "../../types";

const lookupMock = jest.fn();

jest.mock("../../hooks/useIpLookup/useIpLookup", () => ({
  useIpLookup: () => ({ lookup: lookupMock }),
}));

const validateIpMock = jest.fn();
jest.mock("../../utils/ipValidation/ipValidation", () => ({
  validateIp: (value: string) => validateIpMock(value),
}));

const formatLocalTimeMock = jest.fn();
jest.mock("../../utils/formatLocalTime", () => ({
  formatLocalTime: (...args: any[]) => formatLocalTimeMock(...args),
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
  const now = new Date("2026-01-08T10:00:00.000Z");

  beforeEach(() => {
    lookupMock.mockReset();
    validateIpMock.mockReset();
    formatLocalTimeMock.mockReset();
    formatLocalTimeMock.mockReturnValue("12:34");
  });

  test("renders index avatar and textbox", () => {
    render(
      <IpLookupRow
        row={makeRow()}
        index={0}
        now={now}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("input is disabled when row.status is loading", () => {
    render(
      <IpLookupRow
        row={makeRow({ status: "loading", ip: "8.8.8.8" })}
        index={0}
        now={now}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  describe("onBlur", () => {
    test("invalid ip sets error and does not call lookup", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpMock.mockReturnValue({ ok: false, error: "Invalid IPv4" });

      render(
        <IpLookupRow
          row={makeRow({ ip: "bad" })}
          index={0}
          now={now}
          onChange={jest.fn()}
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(lookupMock).not.toHaveBeenCalled();
      expect(onUpdate).toHaveBeenCalledWith({
        status: "error",
        error: "Invalid IPv4",
      });
    });

    test("valid ip sets loading then success", async () => {
      const user = userEvent.setup();
      const onUpdate = jest.fn();

      validateIpMock.mockReturnValue({ ok: true, value: "8.8.8.8" });
      lookupMock.mockResolvedValue({
        country: "United States",
        countryCode: "US",
        timezone: "America/New_York",
      });

      render(
        <IpLookupRow
          row={makeRow({ ip: "8.8.8.8" })}
          index={0}
          now={now}
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

      await waitFor(() => expect(lookupMock).toHaveBeenCalledWith("8.8.8.8"));

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
  });

  test("renders error text when status is error", () => {
    render(
      <IpLookupRow
        row={makeRow({ status: "error", error: "Invalid IPv4" })}
        index={0}
        now={now}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Invalid IPv4")).toBeInTheDocument();
  });

  test("renders time when status is success", () => {
    render(
      <IpLookupRow
        row={makeRow({
          status: "success",
          country: "United States",
          countryCode: "US",
          timezone: "America/New_York",
        })}
        index={0}
        now={now}
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(formatLocalTimeMock).toHaveBeenCalled();
    expect(screen.getByText("12:34")).toBeInTheDocument();
  });
});
