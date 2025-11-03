<script setup>
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import { enUS, de } from "date-fns/locale";
  import { onMounted, ref, computed } from 'vue';
  import i18next from 'i18next';

  import BaseInput from './BaseInput.vue'

  // Define the model and props for the component
  const date = defineModel({
    type: Date,
    required: true
  })
  const props = defineProps({
    allowedDates: {
      type: Array[Number],
      default: undefined
    },
    addDaySwitcher: {
      type: Boolean,
      default: false
    }
  })

  // Computed properties for sorted allowed dates
  const allowedDatesSorted = computed(
    () => props.allowedDates?.slice().sort((a,b) => a - b)
  );

  // Function to check if a date is allowed
  const dateAllowed = (date) => {
    return !(props.allowedDates && !props.allowedDates.includes(date.getDate()));
  }

  // Function to get the next allowed date
  const nextDate = (direction = 1) => {
    if (props.allowedDates) {
      // find next allowed date
      let index = allowedDatesSorted.value
        .map(date => date.valueOf())
        .indexOf(date.value.valueOf());
      if (index === -1) {
        return null;
      }
      return allowedDatesSorted.value[index + direction] || null;
    } else {
      const next = new Date(date.value.valueOf() + 60*60*24*1000 * direction);
      if (dateAllowed(next)) {
        return next;
      }
    }
    return null;
  }

  // Refs for buttons
  const btnPrevRef = ref(null);
  const btnNextRef = ref(null);

  const keyboardNavigation = (event) => {
    if (event.key === "ArrowLeft") {
      const prev = nextDate(-1);
      if (prev !== null) {
        date.value = prev;
      }
    } else if (event.key === "ArrowRight") {
      const next = nextDate(1);
      if (next !== null) {
        date.value = next;
      }
    }
  }
  const focusIn = () => {
    if (props.addDaySwitcher) {
      window.addEventListener('keydown', keyboardNavigation);
    }
  }
  const focusOut = () => {
    if (props.addDaySwitcher) {
      window.removeEventListener('keydown', keyboardNavigation);
    }
  }

  // Initialize tooltips for day switcher buttons
  onMounted(() => {
    if (props.addDaySwitcher) {
      new window.bootstrap.Tooltip(btnPrevRef.value);
      new window.bootstrap.Tooltip(btnNextRef.value);
    }
  });
</script>

<template>
  <BaseInput
    @focusin="focusIn"
    @focusout="focusOut"
  >
    <button
      v-if="addDaySwitcher"
      ref="btnPrevRef"
      class="btn btn-outline-secondary"
      :disabled="nextDate(-1) === null"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:dateInput_previous_day_tooltip')"
      type="button"
      @click="date = nextDate(-1)"
    >
      <i class="bi bi-arrow-left" />
    </button>

    <VueDatePicker
      v-model="date"
      class="form-control"
      style="border: 0; padding: 0px;"
      :allowed-dates="allowedDates"
      :auto-apply="true"
      :time-config="{ enableTimePicker: false }"
      :floating="{arrow: !addDaySwitcher}"
      :transitions="addDaySwitcher ? {next: null, previous: null} : null"
      :locale="i18next.language === 'de' ? de : enUS"
      :formats="{input: 'dd/MM/yyyy'}"
      :input-attrs="{ clearable: false}"
      v-bind="$attrs"
    />

    <button
      v-if="addDaySwitcher"
      ref="btnNextRef"
      class="btn btn-outline-secondary"
      :disabled="nextDate(1) === null"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:dateInput_next_day_tooltip')"
      @click="date = nextDate(1)"
    >
      <i class="bi bi-arrow-right" />
    </button>
  </BaseInput>
</template>

<style scoped>
  .dp__theme_light {
      --dp-border-radius: 0px; /*Configurable border-radius*/
  }
</style>

<style>
  .dp__overlay_cell_disabled{
    color: var(--dp-disabled-color-text);
  }
  .dp__overlay_cell_disabled:hover{
    color: var(--dp-disabled-color-text);
  }
  </style>
