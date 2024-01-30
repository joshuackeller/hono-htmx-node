export const TodoItem = ({
  todo,
}: {
  todo: { id: string; name: string; createdAt: string };
}) => {
  return (
    <div class="flex justify-between w-52" id={`todo-${todo.id}`}>
      <div> {todo.name}</div>
      <button
        hx-delete={`/todos/${todo.id}`}
        hx-target={`#todo-${todo.id}`}
        hx-swap="delete"
        class="cursor-pointer"
      >
        X
      </button>
    </div>
  );
};

export default TodoItem;
