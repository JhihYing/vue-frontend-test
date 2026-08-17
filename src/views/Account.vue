<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import {
  createAccount,
  getAccounts,
  type AccountStatus,
  type RoleLevel,
} from "../api/account";

interface Account {
  id: number;
  name: string;
  email: string;
  roleLevel: "ADMIN" | "USER" | "EDITOR";
  status: "ON" | "OFF";
  createdAt: string;
}

const router = useRouter();
const searchKeyword = ref("");

// const accounts = ref<Account[]>([
//   {
//     id: 1,
//     name: "張小明",
//     email: "ming.chang@example.com",
//     role: "管理員",
//     status: "啟用",
//     createdAt: "2024-01-15",
//   },
//   {
//     id: 2,
//     name: "李美麗",
//     email: "meili.li@example.com",
//     role: "用戶",
//     status: "啟用",
//     createdAt: "2024-02-20",
//   },
//   {
//     id: 3,
//     name: "王大寶",
//     email: "dabao.wang@example.com",
//     role: "編輯",
//     status: "停用",
//     createdAt: "2024-03-10",
//   },
// ]);

const accounts = ref<Account[]>([]);

const isLoading = ref(false);

const fetchAccounts = async () => {
  try {
    isLoading.value = true;

    const data = await getAccounts();

    console.log("帳號列表 API:", data);

    // 先確認 Swagger 實際回傳格式
    accounts.value = data;
  } catch (error) {
    console.error("取得帳號列表失敗", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredAccounts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return accounts.value;
  }

  return accounts.value.filter((account) => {
    return (
      account.name.toLowerCase().includes(keyword) ||
      account.email.toLowerCase().includes(keyword) ||
      account.role.toLowerCase().includes(keyword)
    );
  });
});

const roleText = (roleLevel: Account["roleLevel"]) => {
  const roleMap = {
    ADMIN: "管理員",
    USER: "用戶",
    EDITOR: "編輯",
  };

  return roleMap[roleLevel];
};

const statusText = (status: Account["status"]) => {
  return status === "ON" ? "啟用" : "停用";
};

const totalAccounts = computed(() => accounts.value.length);

const enabledAccounts = computed(
  () => accounts.value.filter((account) => account.status === "ON").length,
);

const disabledAccounts = computed(
  () => accounts.value.length - enabledAccounts.value,
);

const showAddModal = ref(false);

const newAccount = ref({
  name: "",
  email: "",
  roleLevel: "ADMIN" as RoleLevel,
  status: "ON" as AccountStatus,
});

const handleAdd = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const isCreating = ref(false);

const handleCreateAccount = async () => {
  try {
    isCreating.value = true;

    await createAccount({
      name: newAccount.value.name,
      email: newAccount.value.email,
      roleLevel: newAccount.value.roleLevel,
      status: newAccount.value.status,
    });

    // 新增成功後，重新取得帳號列表
    await fetchAccounts();

    showAddModal.value = false;

    // 清空表單
    newAccount.value = {
      name: "",
      email: "",
      roleLevel: "ADMIN",
      status: "ON",
    };
  } catch (error) {
    console.error("新增帳號失敗", error);
  } finally {
    isCreating.value = false;
  }
};

const handleEdit = (account: Account) => {
  console.log("編輯帳號", account);
};

const handleDelete = (account: Account) => {
  console.log("刪除帳號", account);
};

const handleLogout = () => {
  // 清除登入相關資料
  localStorage.removeItem("token");

  // 回到登入頁
  router.push("/login");
};

onMounted(() => {
  fetchAccounts();
});
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fb] text-[#303545]">
    <!-- Header -->
    <header
      class="h-[110px] border-b border-[#e1e3e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
    >
      <div
        class="mx-auto flex h-full max-w-[1280px] items-center justify-between py-4 px-8"
      >
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <div
            class="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#4b3df0]"
          >
            <!-- Users Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div>
            <h1
              class="text-[24px] font-bold leading-tight tracking-wide text-[#171b2b]"
            >
              帳號管理系統
            </h1>

            <p class="mt-1 text-[#5d6475]">管理您的所有帳號</p>
          </div>
        </div>

        <!-- Logout -->
        <button
          type="button"
          class="flex cursor-pointer items-center gap-2 text-[#454b5a] transition hover:text-[#4b3df0]"
          @click="handleLogout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-[20px] w-[20px]"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>

          <span>登出</span>
        </button>
      </div>
    </header>

    <!-- Main -->
    <main class="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
      <!-- Search + Add -->
      <section class="mb-8 flex gap-5">
        <!-- Search -->
        <div class="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-[#9da5b5] w-[20px]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜尋帳號（姓名、郵件、角色）..."
            class="w-full rounded-[13px] border-[1.5px] border-[#d6d9e0] pl-[40px] pr-3 py-3 outline-none transition placeholder:text-[#8b909b] focus:border-[#4b3df0]"
          />
        </div>

        <!-- Add -->
        <button
          type="button"
          class="flex min-w-[140px] p-3 cursor-pointer items-center justify-center gap-3 rounded-[13px] bg-[#4b3df0] text-white transition hover:bg-[#4032d8] active:scale-[0.99]"
          @click="handleAdd"
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          <span>新增帳號</span>
        </button>
      </section>

      <!-- Statistics -->
      <section class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <!-- Total -->
        <div
          class="flex py-6 flex-col justify-center rounded-[13px] border border-[#e0e2e7] bg-white px-7 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
        >
          <p class="text-[#5d6475]">總帳號數</p>

          <p class="mt-2 text-[#171b2b]">
            {{ totalAccounts }}
          </p>
        </div>

        <!-- Enabled -->
        <div
          class="flex py-6 flex-col justify-center rounded-[13px] border border-[#e0e2e7] bg-white px-7 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
        >
          <p class="text-[#5d6475]">啟用中</p>

          <p class="mt-2 text-[#171b2b]">
            {{ enabledAccounts }}
          </p>
        </div>

        <!-- Disabled -->
        <div
          class="flex py-6 flex-col justify-center rounded-[13px] border border-[#e0e2e7] bg-white px-7 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
        >
          <p class="text-[#5d6475]">已停用</p>

          <p class="mt-2 text-[#171b2b]">
            {{ disabledAccounts }}
          </p>
        </div>
      </section>

      <!-- Account Cards -->
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article
          v-for="account in filteredAccounts"
          :key="account.id"
          class="rounded-[12px] border border-[#e0e2e7] bg-white p-6 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
        >
          <!-- User -->
          <div class="mb-7 flex items-center gap-4">
            <div
              class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6848f5] to-[#6b36ee]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-[24px] w-[24px]"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <div>
              <div class="flex items-center gap-2 flex-col">
                <h2 class="text-[#171b2b]">
                  {{ account.name }}
                </h2>

                <span
                  class="rounded-full px-3 py-1 text-white"
                  :class="
                    account.status === 'ON' ? 'bg-[#43c765]' : 'bg-[#9ba1ad]'
                  "
                >
                  {{ statusText(account.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-5">
            <!-- Email -->
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-[20px] w-[20px] shrink-0"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>

              <span class="truncate">
                {{ account.email }}
              </span>
            </div>

            <!-- Role -->
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-[20px] w-[20px] shrink-0"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21a7 7 0 0 1 14 0" />
              </svg>

              <span>{{ roleText(account.roleLevel) }}</span>
            </div>

            <!-- Date -->
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-[20px] w-[20px] shrink-0"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>

              <span>{{ account.createdAt }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-6 h-px bg-[#e5e7eb]"></div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex cursor-pointer items-center py-2 justify-center gap-2 rounded-[8px] bg-[#edf1ff] text-[#4b3df0] transition hover:bg-[#e1e6ff]"
              @click="handleEdit(account)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-5 w-5"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>

              <span>編輯</span>
            </button>

            <button
              type="button"
              class="flex cursor-pointer items-center py-2 justify-center gap-2 rounded-[8px] bg-[#fff2f2] text-[#ef2f2f] transition hover:bg-[#ffe6e6]"
              @click="handleDelete(account)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-5 w-5"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 15H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>

              <span>刪除</span>
            </button>
          </div>
        </article>
      </section>

      <!-- Empty State -->
      <div
        v-if="filteredAccounts.length === 0"
        class="mt-8 rounded-[13px] bg-white py-16 text-center text-[18px] text-[#777d8a]"
      >
        找不到符合條件的帳號
      </div>
    </main>
  </div>

  <!-- Empty State -->
  <div
    v-if="filteredAccounts.length === 0"
    class="mt-8 rounded-[13px] bg-white py-16 text-center text-[18px] text-[#777d8a]"
  >
    找不到符合條件的帳號
  </div>

  <!-- Add Account Modal -->
  <div
    v-if="showAddModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div
      class="w-full max-w-[540px] rounded-[16px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between border-b border-[#e1e3e8] px-7 py-5"
      >
        <h2 class="text-[20px] font-semibold text-[#303545]">新增帳號</h2>

        <button
          type="button"
          class="cursor-pointer text-[#72798a] transition hover:text-[#303545]"
          @click="closeAddModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form class="space-y-6 px-7 py-7" @submit.prevent="handleCreateAccount">
        <!-- Name -->
        <div>
          <label
            for="account-name"
            class="mb-2 block text-[16px] font-medium text-[#454b5a]"
          >
            姓名 <span class="text-red-500">*</span>
          </label>

          <input
            id="account-name"
            v-model="newAccount.name"
            type="text"
            placeholder="請輸入姓名"
            required
            class="w-full rounded-[10px] border border-[#d6d9e1] px-4 py-3 text-[#303545] outline-none transition placeholder:text-[#999da6] focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
          />
        </div>

        <!-- Email -->
        <div>
          <label
            for="account-email"
            class="mb-2 block text-[16px] font-medium text-[#454b5a]"
          >
            電子郵件 <span class="text-red-500">*</span>
          </label>

          <input
            id="account-email"
            v-model="newAccount.email"
            type="email"
            placeholder="email@example.com"
            required
            class="w-full rounded-[10px] border border-[#d6d9e1] px-4 py-3 text-[#303545] outline-none transition placeholder:text-[#999da6] focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
          />
        </div>

        <!-- Role -->
        <div>
          <label
            for="account-role"
            class="mb-2 block text-[16px] font-medium text-[#454b5a]"
          >
            角色 <span class="text-red-500">*</span>
          </label>

          <select
            id="account-role"
            v-model="newAccount.roleLevel"
            required
            class="w-full cursor-pointer appearance-none rounded-[10px] border border-[#d6d9e1] bg-white px-4 py-3 text-[#303545] outline-none transition focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
          >
            <option value="ADMIN">管理員</option>
            <option value="USER">用戶</option>
            <option value="EDITOR">編輯</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label
            for="account-status"
            class="mb-2 block text-[16px] font-medium text-[#454b5a]"
          >
            狀態 <span class="text-red-500">*</span>
          </label>

          <select
            id="account-status"
            v-model="newAccount.status"
            required
            class="w-full cursor-pointer appearance-none rounded-[10px] border border-[#d6d9e1] bg-white px-4 py-3 text-[#303545] outline-none transition focus:border-[#4b3df0] focus:ring-1 focus:ring-[#4b3df0]"
          >
            <option value="ON">啟用</option>
            <option value="OFF">停用</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            class="h-[48px] cursor-pointer rounded-[10px] bg-[#f1f2f4] font-medium text-[#4c5362] transition hover:bg-[#e7e8eb]"
            @click="closeAddModal"
          >
            取消
          </button>

          <button
            type="submit"
            class="h-[48px] cursor-pointer rounded-[10px] bg-[#4b3df0] font-medium text-white transition hover:bg-[#4032d8]"
          >
            新增帳號
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
