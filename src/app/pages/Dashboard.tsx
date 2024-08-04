import { useNavigate } from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import { useAuth } from "~/context/AuthContext";

const Dashboard = () => {
  const auth = useAuth();
  const user = auth.user();
  const navigate = useNavigate();

  createEffect(() => {
    if (!user() || !user()?.isOwner) {
      navigate("/");
    }
  });

  return (
    <>
      <Show when={!!user() && user()?.isOwner} fallback={<p></p>}>
        <p>Dashboard Page (W.I.P)</p>
      </Show>
    </>
  );
};

export default Dashboard;
