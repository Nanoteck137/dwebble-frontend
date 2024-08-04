import { Navigate, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { z } from "zod";
import { useApiClient } from "~/context/ApiClient";
import { useAuth } from "~/context/AuthContext";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const Login = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const auth = useAuth();
  const user = auth.user();

  const [error, setError] = createSignal<string>();

  const submit = async (values: { username: string; password: string }) => {
    const res = await apiClient.signin(values);
    if (res.status === "error") {
      setError(res.error.message);
      return;
    }

    auth.setToken(res.data.token);
    navigate("/");
  };

  {
  }

  return (
    <>
      <Show when={!user()} fallback={<Navigate href="/" />}>
        {error() && <p>Error: {error()}</p>}

        <div class="container mx-auto p-4 md:fixed md:bottom-1/2 md:left-1/2 md:-translate-x-[50%] md:translate-y-1/2">
          <div class="flex w-full flex-col overflow-hidden rounded shadow-md md:flex-row-reverse">
            <div class="flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-t from-[--primary] to-[--accent] p-4 md:bg-gradient-to-r md:p-6">
              <h2 class="text-3xl font-black text-[--bg-color]">Login Page</h2>
              <button class="button-secondary-outline rounded-[50px] px-5 py-3 text-sm">
                Create Account
              </button>
            </div>

            <div class="w-full bg-[--card-bg-color] p-4 text-[--card-fg-color] md:p-6">
              <p class="text-2xl font-light">Login</p>
              <div class="h-6"></div>
              <form
                class="flex flex-col gap-6"
                ref={(e) => {
                  const inputs = e.querySelectorAll("input");

                  e.addEventListener("submit", (e) => {
                    e.preventDefault();

                    const values: Record<string, string> = {};
                    inputs.forEach((i) => {
                      values[i.name] = i.value;
                    });

                    const res = schema.parse(values);
                    submit(res);
                  });
                }}
              >
                <div class="flex flex-col gap-1">
                  <label
                    class="text-sm uppercase tracking-wide"
                    for="username"
                  >
                    Username
                  </label>
                  <input
                    class="border-1 h-12 rounded-[50px] border-[--input-border-color] bg-[--input-bg-color] px-5 text-[--input-fg-color] placeholder:text-[--input-placeholder-color] focus:border-[--input-focus-border-color] focus:ring-0"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label
                    class="text-sm uppercase tracking-wide"
                    for="password"
                  >
                    Password
                  </label>
                  <input
                    class="border-1 h-12 rounded-[50px] border-[--input-border-color] bg-[--input-bg-color] px-5 text-[--input-fg-color] placeholder:text-[--input-placeholder-color] focus:border-[--input-focus-border-color] focus:ring-0"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>

                {/* <button
                  class="rounded-[50px] bg-[--login-button-bg-color] px-5 py-3 text-sm text-[--login-button-fg-color] hover:bg-[--login-hover-button-bg-color] hover:text-[--login-hover-button-fg-color]"
                  type="submit"
                >
                  Login
                </button> */}

                <button
                  class="button-primary rounded-[50px] px-5 py-3 text-sm"
                  type="submit"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Login;
