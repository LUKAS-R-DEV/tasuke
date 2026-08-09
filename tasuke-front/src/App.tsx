import AppRouter from "@/routes/AppRouter.tsx";
import { Toaster } from "@/components/ui/sonner";
import { GlobalLoading } from "@/components/common/GlobalLoading";

function App() {
  return (
    <>
      <GlobalLoading />
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}
export default App;
