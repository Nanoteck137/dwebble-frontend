<form class="flex flex-col gap-4 p-4" method="POST">
  <div class="flex flex-col gap-1">
    <label for="username">Username</label>
    <input
      class="bg-red-200 p-2"
      id="username"
      name="username"
      placeholder="Username"
      type="text"
    />
  </div>

  <div class="flex flex-col gap-1">
    <label for="password">Password</label>
    <input
      class="bg-red-200 p-2"
      id="password"
      name="password"
      placeholder="Password"
      type="text"
    />
  </div>

  <button class="bg-blue-400 py-2 text-white hover:bg-blue-500" type="submit"
    >Login</button
  >
</form>
