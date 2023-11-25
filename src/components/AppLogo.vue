<template>
  <NuxtLink
    to="/"
    class="font-normal flex items-center gap-4 group"
    :class="{
      'text-xl': size === 'lg',
      'text-2xl': size === 'xl',
    }"
  >
    <div class="flex items-center">
      <Icon
        name="mdi:food-takeout-box-outline"
        class="text-pink-400 transition duration-200 group-hover:text-white transform -translate-y-1"
      ></Icon>
      <p
        class="text-blue-500 transition duration-200 group-hover:text-white transform rotate-6 scale-125"
      >
        /
      </p>
      <Icon
        name="mdi:cellphone-iphone"
        class="text-yellow-400 transition duration-200 group-hover:text-white transform translate-y-1"
      ></Icon>
    </div>
    <h1
      :class="
        $cx(
          'text-gray-600 flex dark:text-gray-300/90 group-hover:text-gray-600/30 group-hover:dark:text-gray-300/30 transition duration-200 tracking-tight',
          classes?.text,
        )
      "
    >
      <div>Stuff</div>
      <div
        class="text-blue-400 transform transition duration-400 delay-300 group-hover:scale-110 font-medium font-mono"
      >
        App
      </div>
    </h1>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ClassValue } from "class-variance-authority/dist/types"

withDefaults(
  defineProps<{
    size?: "lg" | "xl"
    classes?: {
      text?: ClassValue
    }
  }>(),
  {
    size: "xl",
    classes: () => ({}),
  },
)
</script>
