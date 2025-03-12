import { Switch } from "./components/Switch";
import { Input } from "./components/input";
import IPut from "./ipinput";
function App() {
  return (
    <>
      <div className=" m-auto w-3/6 p-10 text-center">
        <h1 className="text-3xl font-bold">React+shadcn+vite</h1>
        <Switch />
        <Input />
        <Switch />
        <IPut />
      </div>
    </>
  );
}

export default App;
