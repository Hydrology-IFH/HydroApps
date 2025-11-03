<script setup>
  import { VDateInput } from 'vuetify/labs/VDateInput';
  import { onMounted, ref, computed } from 'vue';
  import BaseInput from './BaseInput.vue'


  const date = defineModel({
    type: Date,
    required: true
  })
  const props = defineProps({
    allowedYears: {
      type: Array[Number],
      default: undefined
    },
    allowedMonths: {
      type: Array[Number],
      default: undefined,
    },
    allowedDates: {
      type: Array[Number],
      default: undefined
    },
    addDaySwitcher: {
      type: Boolean,
      default: false
    }
  })

  const allowedMonthsJS = computed(
    () => props.allowedMonths?.map(m => m - 1).slice().sort((a,b) => a - b)
  );
  const allowedDatesSorted = computed(
    () => props.allowedDates?.slice().sort((a,b) => a - b)
  );
  const allowedYearsSorted = computed(
    () => props.allowedYears?.slice().sort((a,b) => a - b)
  );

  const dateAllowed = (date) => {
    if (props.allowedYears && !props.allowedYears.includes(date.getFullYear())) {
      return false;
    }
    if (props.allowedMonths && !allowedMonthsJS.value.includes(date.getMonth())) {
      return false;
    }
    if (props.allowedDates && !props.allowedDates.includes(date.getDate())) {
      return false;
    }
    return true;
  }

  const nextDate = (direction = 1) => {
    const next = new Date(date.value.valueOf() + 60*60*24*1000 * direction);
    if (dateAllowed(next)) {
      date.value = next;
    } else {
      if (props.allowedDates) {
        // find next allowed date
        let index = allowedDatesSorted.value.indexOf(date.value.getDate());
        let next = allowedDatesSorted.value[index + direction];
        return next;
      }
      if (props.allowedMonths) {
        // find next allowed month
        let index = allowedMonthsJS.value.indexOf(date.value.getMonth());
        let nextMonth = allowedMonthsJS.value[index + direction];
        if (nextMonth === undefined && props.allowedYears?.length > 0) {
          // wrap around year
          nextMonth = allowedMonthsJS.value[direction == 1 ? 0 : allowedMonthsJS.value.length -1];
          let index = allowedYearsSorted.value.indexOf(date.value.getFullYear());
          let nextYear = allowedYearsSorted.value[index + direction];
          let newDate = new Date(
            nextYear,
            direction == 1 ? nextMonth + 1 : nextMonth,
            direction == 1 ? 0 : 1);
          if (dateAllowed(newDate)) {
            return newDate;
          } else {
            return null;
          }
        }
        let newDate = new Date(
          date.value.getFullYear(),
          direction == 1 ? nextMonth + 1 : nextMonth,
          direction == 1 ? 0 : 1);
        if (dateAllowed(newDate)) {
          return newDate;
        } else {
          return null;
        }
      }
    }
    return null;
  }

  window.nextDate = nextDate; // for debugging

  const btnPrevRef = ref(null);
  const btnNextRef = ref(null);
  onMounted(() => {
    new window.bootstrap.Tooltip(btnPrevRef.value);
    new window.bootstrap.Tooltip(btnNextRef.value);
  });

  window.date = date; // for debugging
</script>

<template>
  <BaseInput>
    <button
      v-if="addDaySwitcher"
      ref="btnPrevRef"
      class="btn btn-outline-secondary"
      :disabled="!nextDate(-1)"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:dateInput_previous_day_tooltip')"
      type="button"
      @click="date = nextDate(-1)"
    >
      <i class="bi bi-arrow-left" />
    </button>

    <VDateInput
      v-model="date"
      class="form-control"
      style="border-top-left-radius: 0; padding:0;"
      prepend-icon=""
      :allowed-years="allowedYears"
      :allowed-months="allowedMonthsJS"
      :allowed-dates="allowedDates"
      density="comfortable"
      variant="filled"
      hide-details
      :show-adjacent-months="false"
      text="hallo"
      view-mode="month"
    />
    <button
      v-if="addDaySwitcher"
      ref="btnNextRef"
      class="btn btn-outline-secondary"
      :disabled="dateAllowed(new Date(date.valueOf() + 60*60*24*1000))"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:dateInput_next_day_tooltip')"
      @click="date.setDate(date.getDate() + 1)"
    >
      <i class="bi bi-arrow-right" />
    </button>
  </BaseInput>
</template>
