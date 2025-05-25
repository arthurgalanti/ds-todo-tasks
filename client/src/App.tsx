import { TaskProvider, useTasks } from './contexts/TaskContext';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import TaskList from './components/TaskList';

function AppContent() {
  const { setSearchTerm } = useTasks();

  return (
    <Layout onSearch={setSearchTerm}>
      <TaskList />
    </Layout>
  );
}

function App() {
  return (
    <TaskProvider>
      <GlobalStyles />
      <AppContent />
    </TaskProvider>
  );
}

export default App;