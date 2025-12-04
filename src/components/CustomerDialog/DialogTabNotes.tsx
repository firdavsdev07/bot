import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { borderRadius, shadows } from "../../theme/colors";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { addNotes, getNotes } from "../../store/actions/notesActions";
import { INote } from "../../types/Notes";

interface IProps {
  customerId: string;
}

const DialogTabNotes: FC<IProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();
  const { notes, isLoading } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);
  const [note, setNote] = useState("");

  useEffect(() => {
    dispatch(getNotes(customerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleAddComment = () => {
    if (!note.trim()) return;
    const data: INote = {
      notes: note,
      customerId,
    };
    dispatch(addNotes(data));
    setNote("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        display="flex"
        gap={1.5}
        mb={3}
        sx={{
          p: 2,
          borderRadius: borderRadius.md,
          bgcolor: "background.paper",
          boxShadow: shadows.sm,
        }}
      >
        <TextField
          id="comment-input"
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Yangi izoh yozing..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: borderRadius.md,
            },
          }}
        />
        <IconButton
          aria-label="add"
          onClick={handleAddComment}
          disabled={!note.trim()}
          sx={{
            width: 48,
            height: 48,
            borderRadius: borderRadius.sm,
            bgcolor: "primary.main",
            color: "white",
            alignSelf: "flex-end",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&:disabled": {
              bgcolor: "grey.300",
              color: "grey.500",
            },
          }}
        >
          <Plus size={24} />
        </IconButton>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : notes.length === 0 ? (
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: borderRadius.md,
            boxShadow: shadows.sm,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Izohlar mavjud emas
          </Typography>
        </Paper>
      ) : (
        <List sx={{ py: 0 }}>
          {notes.map((note) => {
            const isMine = note.createBy === user.id;
            return (
              <ListItem
                key={note._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  p: 0,
                  alignItems: "stretch",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: borderRadius.md,
                    boxShadow: shadows.sm,
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection={isMine ? "row-reverse" : "row"}
                    alignItems="flex-start"
                    gap={1.5}
                    width="100%"
                  >
                    <Avatar
                      sx={{ 
                        bgcolor: "primary.main", 
                        color: "#fff",
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                      }}
                    >
                      {note.fullName?.charAt(0) || "?"}
                    </Avatar>
                    <Box 
                      sx={{ 
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize="0.9rem"
                        textAlign={isMine ? "end" : "start"}
                        color="primary.main"
                        sx={{ mb: 0.5 }}
                      >
                        {note.fullName}
                      </Typography>
                      <Typography
                        sx={{
                          px: 2,
                          py: 1.5,
                          bgcolor: isMine ? "primary.lighter" : "grey.100",
                          borderRadius: borderRadius.sm,
                          fontSize: "0.9rem",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {note.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        textAlign={isMine ? "end" : "start"}
                        sx={{ mt: 0.5 }}
                      >
                        {new Date(note.createdAt).toLocaleString("uz-UZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default DialogTabNotes;
