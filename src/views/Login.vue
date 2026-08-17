<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleLogin = () => {
  router.push("/accounts");
};
</script>

<template>
  <main
    class="flex min-h-screen items-center justify-center bg-[#EDF3FE] p-4 flex-col"
  >
    <!-- Login Card -->
    <section
      class="w-full max-w-[448px] rounded-[16px] bg-white p-8 md:p-10 shadow-[0_10px_30px_rgba(40,50,80,0.10)]"
    >
      <!-- Icon -->
      <div class="flex justify-center">
        <div
          class="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#4C3AEC]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-[32px] w-[32px]"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path d="m10 17 5-5-5-5" />
            <path d="M15 12H3" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <div class="mt-4 text-center">
        <h1>歡迎回來</h1>

        <p class="mt-2 text-[#4a5565]">請登入您的帳號以繼續</p>
      </div>

      <!-- Form -->
      <form class="mt-8" @submit.prevent="handleLogin">
        <!-- Email -->
        <div>
          <label for="email" class="mb-2 block"> 電子郵件 </label>

          <div class="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9da4b2] w-[20px]"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
              required
              class="w-full rounded-[8px] border-[1.5px] border-[#d6d9e1] bg-white pl-[40px] pr-3 py-3 outline-none transition placeholder:text-[#8f9299] hover:border-[#c7cad3] focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="mt-6">
          <label for="password" class="mb-2 block"> 密碼 </label>

          <div class="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9da4b2] w-[20px]"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              class="w-full rounded-[8px] border-[1.5px] border-[#d6d9e1] bg-white pl-[40px] pr-3 py-3 outline-none transition placeholder:text-[#8f9299] hover:border-[#c7cad3] focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
            />
          </div>
        </div>

        <!-- Remember / Forgot -->
        <div class="mt-6 flex items-center justify-between">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-[13px] w-[13px] cursor-pointer accent-[#4C3AEC]"
            />

            <span>記住我</span>
          </label>

          <button
            type="button"
            class="cursor-pointer text-[#4C3AEC] transition hover:opacity-70"
          >
            忘記密碼？
          </button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="mt-6 flex h-[48px] w-full cursor-pointer items-center justify-center gap-3 rounded-[8px] bg-[#4C3AEC] text-white transition hover:bg-[#4032d8] active:scale-[0.99]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-[20px] w-[20px]"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path d="m10 17 5-5-5-5" />
            <path d="M15 12H3" />
          </svg>

          <span>登入</span>
        </button>

        <!-- Hint -->
        <div
          class="mt-6 flex p-4 items-center justify-center rounded-[8px] border-[1.5px] border-[#c8dcff] bg-[#F0F6FE] px-4 text-center text-[#193cb8]"
        >
          <span class="mr-2 shrink-0 text-[16px]">💡</span>

          <span>提示：輸入任意電子郵件和密碼即可登入</span>
        </div>
      </form>
    </section>

    <!-- Register -->
    <p class="mt-6 text-center text-gray-600">
      還沒有帳號？
      <a href="#" class="text-indigo-600 hover:text-indigo-700"> 立即註冊 </a>
    </p>
  </main>
</template>
