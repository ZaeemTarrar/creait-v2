import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    update: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export default counterSlice.reducer;
export const { increment, decrement, incrementByAmount, update, reset } = counterSlice.actions;
