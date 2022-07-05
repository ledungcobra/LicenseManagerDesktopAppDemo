import React, { useEffect } from 'react';
import AddTodoForm from 'renderer/components/AddTodoForm';
import Button from 'renderer/components/Button';
import TodoItem from 'renderer/components/TodoItem';
import { useLicenseContext } from 'renderer/provider/LicenseProvider';
import { useNotificationContext } from 'renderer/provider/NotificationProvider';
import { TIME_OUT_CHECK_LICENSE } from 'renderer/utils/Constants';

type Props = {};

const MainScreen = ({}: Props) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const ctx = useLicenseContext();
  const notiCtx = useNotificationContext();

  const [showAddTodoForm, setShowAddTodoForm] = React.useState(false);
  const intervalRef = React.useRef<any>();
  useEffect(() => {
    if (!ctx) return;
    intervalRef.current = setInterval(() => {
      ctx.checkValidity();
    }, TIME_OUT_CHECK_LICENSE);
    if (ctx.isValid) {
      window.electron.ipcRenderer.sendMessage('load-todos', []);
      window.electron.ipcRenderer.once('load-todos-reply', (_, todos) => {
        try {
          setTodos(JSON.parse(todos as string));
        } catch (e) {
          setTodos([]);
        }
      });
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [ctx]);

  const onComplete = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const onDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onAddNewTodo = (title: string) => {
    setTodos([...todos, { id: todos.length, title, completed: false }]);
  };

  const save = () => {
    window.electron.ipcRenderer.sendMessage('save-todos', [
      JSON.stringify(todos),
    ]);
    window.electron.ipcRenderer.once('save-todos-reply', (data) => {
      console.log(data);
    });
  };

  const onRemoveLicense = async () => {
    try {
      await ctx?.licenseStorage.removeLicense();
      notiCtx.show('License removed successfully', 'success');
      ctx?.checkValidity();
    } catch (e: any) {
      notiCtx.show('Error while removing license ' + e.message, 'error');
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-end w-full mb-5 space-x-2">
        <Button danger onClick={onRemoveLicense}>
          Remove License
        </Button>
        <Button onClick={() => setShowAddTodoForm(!showAddTodoForm)}>
          {showAddTodoForm ? 'Close' : 'Add new todo'}
        </Button>
        <Button onClick={save}>Save</Button>
      </div>
      {/* TODO form */}
      {showAddTodoForm && <AddTodoForm onSubmit={onAddNewTodo} />}
      {/* TODO container */}
      <div className="space-y-2 overflow-y-auto">
        {todos.map((it, index) => (
          <TodoItem
            key={index}
            todo={it}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MainScreen;
