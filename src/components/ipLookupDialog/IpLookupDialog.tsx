import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { IpLookupList } from "../ipLookupList/IpLookupList";
import type { IpLookupRowModel } from "../../types";
import { colors } from "../../theme/colors";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContent: {
    p: 3,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    direction: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dividerTop: {
    my: 1,
  },
  contentTop: {
    width: "100%",
    alignItems: "flex-start",
    spacing: 2,
  },
  helperText: {
    color: colors.textMuted,
    textAlign: "left",
    width: "100%",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
  addButton: {
    backgroundColor: colors.primary,
    "&:hover": { backgroundColor: colors.primaryHover },
    fontWeight: 600,
    "&:focus, &:focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.focus}`,
    },
    textTransform: "none",
    px: 2,
    py: 0.5,
    borderRadius: 1,
    minWidth: 0,
    "& .MuiButton-startIcon": {
      marginRight: 1,
    },
    "&.Mui-disabled": {
      backgroundColor: colors.primary,
      opacity: 0.6,
      color: "#fff",
    },
  },
  dividerBottom: {
    width: "100%",
    my: 1,
  },
  dialogPaper: {
    height: 380,
    overflow: "hidden",
  },
  listScroll: {
    width: "100%",
    minHeight: 0,
    flex: "1 1 auto",
    overflowY: "auto",
    overflowX: "hidden",
    pr: 1,
    pb: 1,
    pt: 2,
  },
} as const;

export function IpLookupDialog() {
  const [rows, setRows] = useState<IpLookupRowModel[]>([
    { id: crypto.randomUUID(), ip: "", status: "idle" },
  ]);
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ip: "", status: "idle" },
    ]);
  };

  const updateRow = (id: string, data: Partial<IpLookupRowModel>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const isLoading = rows.some((row) => row.status === "loading");

  return (
    <Box sx={styles.page}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: styles.dialogPaper }}
      >
        <DialogContent sx={styles.dialogContent}>
          <Stack {...styles.header}>
            <Typography variant="h5" fontWeight={700}>
              IP Lookup
            </Typography>

            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={styles.dividerTop} />

          <Stack sx={styles.contentTop} spacing={2}>
            <Typography variant="body2" sx={styles.helperText}>
              Enter one or more IP addresses and get their country
            </Typography>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              disableElevation
              disabled={isLoading}
              sx={styles.addButton}
              onClick={addRow}
            >
              Add
            </Button>

            <Divider sx={styles.dividerBottom} />
          </Stack>

          <Box sx={styles.listScroll}>
            <IpLookupList rows={rows} updateRow={updateRow} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
