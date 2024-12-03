import { ExpensesTracker } from "./components/expenses-tracker";
import { ExpensesTable } from "./components/expenses-table";
import {
  getBudgetAction,
  getExpensesAction,
} from "@/actions/expenpence-actions";
import { Budget } from "./components/budget";

const ExpensesPage = async () => {
  const { data, totalExpenses, success } = await getExpensesAction();
  const { data: budget } = await getBudgetAction();

  console.log("totalExpenses", totalExpenses);

  return (
    <div className="flex flex-col gap-4">
      {budget && <Budget budget={budget} totalExpenses={totalExpenses ?? 0} />}
      <ExpensesTracker />
      <ExpensesTable expenses={data ?? []} />
    </div>
  );
};

export default ExpensesPage;
