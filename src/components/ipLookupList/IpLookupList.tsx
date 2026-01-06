import { Stack } from "@mui/material";
import type { IpLookupRowModel } from "../../types";
import { IpLookupRow } from "../ipLookupRow/IpLookupRow";

interface IpLookupListProps {
  rows: IpLookupRowModel[];
  updateRow(id: string, data: Partial<IpLookupRowModel>): void;
}

export function IpLookupList({ rows, updateRow }: IpLookupListProps) {
  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      {rows.map((row, index) => (
        <IpLookupRow
          key={row.id}
          row={row}
          index={index}
          onChange={(ip) => updateRow(row.id, { ip })}
          onUpdate={(data) => updateRow(row.id, data)}
        />
      ))}
    </Stack>
  );
}
