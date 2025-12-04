import {
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
} from "@mui/material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
  MdIncompleteCircle,
  MdModeEdit,
  MdOutlineMoreVert,
} from "react-icons/md";
import { useCallback, useState } from "react";
import { openExpensesModal } from "../../../store/slices/expensesSlice";
import { IExpenses } from "../../../types/IExpenses";
import { returnExpenses } from "../../../store/actions/expensesActions";

export default function ActionExpenses({ expenses }: { expenses: IExpenses }) {
  const dispatch = useAppDispatch();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleSelect = useCallback(() => {
    dispatch(openExpensesModal({ type: "edit", data: expenses }));
    handleClosePopover();
  }, [dispatch, expenses, handleClosePopover]);

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnExpenses(id));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );

  return (
    <>
      <IconButton
        edge="end"
        aria-label="more"
        onClick={(e) => {
          handleOpenPopover(e);
          e.stopPropagation();
        }}
      >
        <MdOutlineMoreVert />
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          <MenuItem onClick={handleSelect}>
            <MdModeEdit />
            Tahrirlash
          </MenuItem>
          <MenuItem onClick={() => handleReturn(expenses.id)}>
            <MdIncompleteCircle />
            Qaytarish
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
