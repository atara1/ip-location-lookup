import { TextField, Stack, Typography, Box, Avatar } from "@mui/material";
import type { IpLookupRowModel } from "../../types";
import { useIpLookup } from "../../hooks/useIpLookup/useIpLookup";
import { colors } from "../../theme/colors";
import { formatLocalTime } from "../../utils/formatLocalTime";
import { validateIp } from "../../utils/ipValidation/ipValidation";

interface IpLookupRowProps {
  row: IpLookupRowModel;
  index: number;
  now: Date;
  onChange(ip: string): void;
  onUpdate(data: Partial<IpLookupRowModel>): void;
}

const styles = {
  row: {
    width: "100%",
  },
  indexAvatar: {
    width: 28,
    height: 28,
    fontSize: 14,
    bgcolor: colors.indexBg,
    color: colors.indexText,
  },
  textField: {
     flexShrink: 0,
  minWidth: 180,
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #fff inset",
    },
    "& .MuiOutlinedInput-root": {
      height: 30,

      "& fieldset": {
        borderColor: colors.border,
        borderWidth: 2,
      },
      "&:hover fieldset": {
        borderColor: colors.focus,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.focus,
      },
    },
  },
  rightArea: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    minHeight: 24,
  },
  flagImg: {
    width: 24,
    height: 18,
    borderRadius: "2px",
    flexShrink: 0,
  },
  loader: {
    width: 18,
    height: 18,
    border: "2px dashed #9ca3af",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    flexShrink: 0,
  },
} as const;

export function IpLookupRow({
  row,
  index,
  now,
  onChange,
  onUpdate,
}: IpLookupRowProps) {
  const { lookup } = useIpLookup();

  const localTime = row.timezone ? formatLocalTime(now, row.timezone) : "";

  const flagUrl = row.countryCode
    ? `https://flagcdn.com/24x18/${row.countryCode.toLowerCase()}.png`
    : undefined;

  const onBlur = async (): Promise<void> => {
   const result = validateIp(row.ip);
if (!result.ok) {
  onUpdate({ status: "error", error: result.error });
  return;
}
const ip = result.value;

    try {
      onUpdate({ status: "loading", error: undefined });
      const result = await lookup(ip);
      onUpdate({
        status: "success",
        country: result.country,
        countryCode: result.countryCode,
        timezone: result.timezone,
        error: undefined,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      onUpdate({ status: "error", error: message });
    }
  };

return (
  <Stack sx={styles.row} spacing={0.5}>
    {/* Row line */}
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={styles.indexAvatar}>{index + 1}</Avatar>

      <TextField
        size="small"
        sx={styles.textField}
        value={row.ip}
        disabled={row.status === "loading"}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />

      <Box sx={styles.rightArea}>
        {(row.status === "loading" ||
          (row.status === "success" && !localTime)) && (
          <Box sx={styles.loader} />
        )}

        {row.status === "success" && localTime && (
          <>
            {flagUrl && (
              <Box
                component="img"
                src={flagUrl}
                alt={`${row.country} flag`}
                sx={styles.flagImg}
              />
            )}
            <Typography>{localTime}</Typography>
          </>
        )}
      </Box>
    </Stack>

    {/* Error line (below) */}
    {row.status === "error" && (
      <Typography
        color="error"
        variant="caption"
        sx={{
          pl: "calc(28px + 16px)", // Avatar width + spacing (approx)
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {row.error}
      </Typography>
    )}
  </Stack>
);

}


