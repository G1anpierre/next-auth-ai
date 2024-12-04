"use client";

import { categories, columns } from "@/utils/data";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import React from "react";
import { Expense } from "@prisma/client";
import { Trash2, Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { deleteExpenseAction } from "@/actions/expenpence-actions";

type ExpenseWithActions = Omit<Expense, "createdAt" | "updatedAt"> & {
  actions?: string; // Adding optional actions field for UI purposes
};

export const ExpensesTable = ({ expenses }: { expenses: Expense[] }) => {
  const renderCell = React.useCallback((expense: ExpenseWithActions, columnKey: string) => {
    const cellValue = expense[columnKey as keyof ExpenseWithActions];

    switch (columnKey) {
      case "category":
        return (
          <Chip size="sm" variant="flat">
            {expense.category}
          </Chip>
        );
      case "amount":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        );
      case "recurring":
        return (
          <Chip
            className="capitalize"
            color={cellValue ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {cellValue ? "Yes" : "No"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex justify-center w-full">
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit expense">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Pencil size={16} />
                </span>
              </Tooltip>
              <Tooltip content="Delete expense">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2 size={16} onClick={() => deleteExpenseAction(expense.id)} />
                </span>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={expenses}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
