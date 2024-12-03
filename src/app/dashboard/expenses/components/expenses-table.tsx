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
import { Icon } from "@iconify/react";
import { Expense } from "@prisma/client";

export const ExpensesTable = ({ expenses }: { expenses: Expense[] }) => {
  const renderCell = React.useCallback(
    (expense: Omit<Expense, "createdAt" | "updatedAt">, columnKey: string) => {
      const cellValue =
        expense[columnKey as keyof Omit<Expense, "createdAt" | "updatedAt">];

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
                {expense.amount}
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
            <div className="relative flex items-center gap-2">
              <Tooltip color="danger" content="Delete category">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Icon icon="solar:trash-bin-line-duotone" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={expenses}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
