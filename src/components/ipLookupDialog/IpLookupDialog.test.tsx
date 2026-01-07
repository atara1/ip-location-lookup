import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { IpLookupDialog } from "./IpLookupDialog";

const ipLookupListMock = jest.fn();

jest.mock("../ipLookupList/IpLookupList", () => ({
  IpLookupList: (props: any) => {
    ipLookupListMock(props);
    return <div data-testid="ip-lookup-list" />;
  },
}));

function getLatestListProps() {
  const call = ipLookupListMock.mock.calls.at(-1);
  if (!call) throw new Error("IpLookupList was not rendered");
  return call[0];
}

describe("IpLookupDialog", () => {
  beforeEach(() => {
    ipLookupListMock.mockClear();
  });

  it("renders title and helper text", () => {
    render(<IpLookupDialog />);

    expect(screen.getByText("IP Lookup")).toBeInTheDocument();
    expect(
      screen.getByText("Enter one or more IP addresses and get their country")
    ).toBeInTheDocument();

    expect(screen.getByTestId("ip-lookup-list")).toBeInTheDocument();
  });

  it("initially renders with one row", () => {
    render(<IpLookupDialog />);

    const props = getLatestListProps();
    expect(props.rows).toHaveLength(1);
    expect(props.rows[0]).toEqual(
      expect.objectContaining({ ip: "", status: "idle" })
    );
    expect(typeof props.rows[0].id).toBe("string");
    expect(typeof props.updateRow).toBe("function");
  });

  it("clicking Add adds a new row", async () => {
    const user = userEvent.setup();
    render(<IpLookupDialog />);

    const addBtn = screen.getByRole("button", { name: /^add$/i });
    await user.click(addBtn);

    const props = getLatestListProps();
    expect(props.rows).toHaveLength(2);
    expect(props.rows[1]).toEqual(
      expect.objectContaining({ ip: "", status: "idle" })
    );
  });

  it("clicking Close (X) hides the dialog", async () => {
    const user = userEvent.setup();
    render(<IpLookupDialog />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("Add button becomes disabled when any row is loading, then re-enabled", async () => {
    render(<IpLookupDialog />);

    const addBtn = screen.getByRole("button", { name: /^add$/i });
    expect(addBtn).toBeEnabled();

    const initialProps = getLatestListProps();
    const firstRowId = initialProps.rows[0].id as string;

    await act(async () => {
      initialProps.updateRow(firstRowId, { status: "loading" });
    });

    expect(screen.getByRole("button", { name: /^add$/i })).toBeDisabled();

    const loadingProps = getLatestListProps();
    await act(async () => {
      loadingProps.updateRow(firstRowId, { status: "success", country: "X" });
    });

    expect(screen.getByRole("button", { name: /^add$/i })).toBeEnabled();
  });

  it("updateRow updates the correct row by id", async () => {
    render(<IpLookupDialog />);

    const props = getLatestListProps();
    const rowId = props.rows[0].id as string;

    await act(async () => {
      props.updateRow(rowId, { ip: "8.8.8.8" });
    });

    await waitFor(() => {
      const updatedProps = getLatestListProps();
      expect(updatedProps.rows[0]).toEqual(
        expect.objectContaining({ id: rowId, ip: "8.8.8.8" })
      );
    });
  });
});
