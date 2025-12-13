import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  incrementAction,
  decrementAction,
  incrementByAmountAction,
  resetAction,
  addAsyncAction,
} from "../../store/features/counter";

const Counter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return (
    <div className="container mt-5">
      <h2>Counter: {count}</h2>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={() => dispatch(incrementAction())}>
          Increment
        </button>

        <button className="btn btn-danger" onClick={() => dispatch(decrementAction())}>
          Decrement
        </button>

        <button className="btn btn-success" onClick={() => dispatch(incrementByAmountAction(5))}>
          Increase by 5
        </button>

        <button className="btn btn-success" onClick={() => dispatch(addAsyncAction(25))}>
          Add 25
        </button>

        <button className="btn btn-warning" onClick={() => dispatch(resetAction())}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
