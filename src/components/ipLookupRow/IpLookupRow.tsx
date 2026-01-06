import { TextField, Stack, Typography, Box, Avatar } from "@mui/material";
import type { IpLookupRowModel } from "../../types";
import { useIpLookup } from "../../hooks/useIpLookup/useIpLookup";
import { useLocalTime } from "../../hooks/useLocalTime";
import { colors } from "../../theme/colors";
import { validateIpv4 } from "../../utils/ipValidation/ipValidation";

interface IpLookupRowProps {
  row: IpLookupRowModel;
  index: number;
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
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #fff inset",
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
  onChange,
  onUpdate,
}: IpLookupRowProps) {
  const { lookup } = useIpLookup();
  const localTime = useLocalTime(row.timezone);

  const flagUrl = row.countryCode
    ? `https://flagcdn.com/24x18/${row.countryCode.toLowerCase()}.png`
    : undefined;

  const onBlur = async (): Promise<void> => {
    const result = validateIpv4(row.ip);
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
    <Stack direction="row" spacing={2} alignItems="center" sx={styles.row}>
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
        {row.status === "loading" && <Box sx={styles.loader} />}

        {row.status === "error" && (
          <Typography color="error">{row.error}</Typography>
        )}

        {row.status === "success" && (
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
  );
}
