import { render, screen } from "@testing-library/react";
import { IpLookupList } from "./IpLookupList";
import type { IpLookupRowModel } from "../../types";

const rowMock = jest.fn();

jest.mock("../ipLookupRow/IpLookupRow", () => ({
  IpLookupRow: (props: any) => {
    rowMock(props);
    return <div data-testid="ip-lookup-row" />;
  },
}));

describe("IpLookupList", () => {
  beforeEach(() => {
    rowMock.mockClear();
  });

  it("renders one IpLookupRow per row", () => {
    const rows: IpLookupRowModel[] = [
      { id: "1", ip: "", status: "idle" } as IpLookupRowModel,
      { id: "2", ip: "", status: "idle" } as IpLookupRowModel,
    ];

    const updateRow = jest.fn();

    render(<IpLookupList rows={rows} updateRow={updateRow} />);

    expect(screen.getAllByTestId("ip-lookup-row")).toHaveLength(2);
    expect(rowMock).toHaveBeenCalledTimes(2);
  });

  it("onChange to updateRow with row id", () => {
    const rows: IpLookupRowModel[] = [
      { id: "abc", ip: "", status: "idle" } as IpLookupRowModel,
    ];
    const updateRow = jest.fn();

    render(<IpLookupList rows={rows} updateRow={updateRow} />);

    const props = rowMock.mock.calls[0][0];
    props.onChange("8.8.8.8");

    expect(updateRow).toHaveBeenCalledWith("abc", { ip: "8.8.8.8" });
  });

  it("onUpdate to updateRow with row id", () => {
    const rows: IpLookupRowModel[] = [
      { id: "abc", ip: "", status: "idle" } as IpLookupRowModel,
    ];
    const updateRow = jest.fn();

    render(<IpLookupList rows={rows} updateRow={updateRow} />);

    const props = rowMock.mock.calls[0][0];
    props.onUpdate({ status: "loading" });

    expect(updateRow).toHaveBeenCalledWith("abc", { status: "loading" });
  });
});
