import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
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
  }, [customerId, dispatch]);

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
    <Box
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        fontWeight={600}
        textAlign="left"
        color="primary.main"
      >
        Izohlar
      </Typography>

      <Box
        display="flex"
        gap={2}
        mb={3}
        alignItems="flex-end"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.100",
          background: "#fff",
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
        />
        <IconButton
          aria-label="add"
          onClick={handleAddComment}
          disabled={!note.trim()}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&:disabled": {
              bgcolor: "grey.300",
              color: "primary.main",
            },
          }}
        >
          <MdAdd size={24} />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : notes.length === 0 ? (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Izohlar mavjud emas
          </Typography>
        </Paper>
      ) : (
        <List sx={{ py: 1 }}>
          {notes.map((note) => {
            const isMine = note.createBy === user.id;
            return (
              <ListItem
                key={note._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: 1,
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  display="flex"
                  flexDirection={isMine ? "row-reverse" : "row"}
                  alignItems="flex-start"
                  gap={2}
                  width="100%"
                >
                  <Avatar
                    sx={{ bgcolor: "primary.main", color: "#fff", mt: 1 }}
                  >
                    {note.fullName?.charAt(0) || "?"}
                  </Avatar>
                  <Box width="100%">
                    <Typography
                      fontWeight={600}
                      textAlign={isMine ? "end" : "start"}
                      color="primary.main"
                      mt={2}
                    >
                      {note.fullName}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        px: 2,
                        py: 1,
                        bgcolor: "#f0f4ff",
                        borderRadius: 2,
                        fontSize: "0.95rem",
                      }}
                    >
                      {note.text}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="#0D47A1"
                  textAlign={isMine ? "left" : "right"}
                  mt={1}
                  width="100%"
                >
                  {new Date(note.createdAt).toLocaleString("uz-UZ")}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default DialogTabNotes;
