import { increment, decrement, incrementByAmount, update, reset } from "./reducer";
import type { AppDispatch, RootState } from "../../index";

export const incrementAction = () => increment();
export const decrementAction = () => decrement();
export const resetAction = () => reset();
export const updateAction = (amount: number) => update(amount);
export const incrementByAmountAction = (amount: number) => incrementByAmount(amount);

export const addAsyncAction = (amount: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    dispatch(update(state.counter.value + amount));
  };
};
