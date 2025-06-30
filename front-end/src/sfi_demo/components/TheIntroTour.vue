<template>
  <VOnboardingWrapper
    ref="wrapper"
    :steps="steps"
    :options="options"
  />
  <div>
    <a
      ref=""
      class="onboarding-button"
      data-html2canvas-ignore
      @click="start"
    >
      <i
        ref="buttonRef"
        class="bi bi-question-circle"
        :data-bs-title="$t('onboarding_button_tooltip')"
        data-bs-placement="auto"
        data-bs-toggle="tooltip"
      />
    </a>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
  import 'v-onboarding/dist/style.css'

  import { useTranslation } from 'i18next-vue'

  import { useConfig } from '~/stores/config.js'

  const { i18next } = useTranslation()
  const config = useConfig()

  const wrapper = ref(null)
  const buttonRef = ref(null)
  const { start, finish, goToStep } = useVOnboarding(wrapper)

  const options = ref({
    labels: {
      previousButton: i18next.t("onboarding_button_previous"),
      nextButton: i18next.t("onboarding_button_next"),
      finishButton: i18next.t("onboarding_button_finish")
    },
    overlay: {
      padding: 3,
      borderRadius: 5
    },
    popper: {
      placement: 'auto',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  })

  const activate_region_selection = () => {
    config.region = "";
    config.region_selection_active = true;
  }
  const activate_region= () => {
    config.region = "Emmendingen";
    config.region_selection_active = false;
  }
  const activate_region_ifneeded = () => {
    if (config.region == "") {
      config.region = "Emmendingen";
    }
    if (config.region_selection_active) {
      config.region_selection_active = false;
    }
  }

  const steps = ref([
    {
      attachTo: {
        element: '#flow-chart'
      },
      content: {
        title: i18next.t("onboarding_flowchart_title"),
        description:  i18next.t("onboarding_flowchart_description")
      },
    },
    {
      attachTo: {
        element: '#map'
      },
      content: {
        title: i18next.t("onboarding_map_region_title"),
        description: i18next.t("onboarding_map_region_description")
      },
      on: {
        beforeStep: activate_region_selection
      },
    },
    {
      attachTo: {
        element: '#menu-region'
      },
      content: {
        title: i18next.t("onboarding_menu_region_title"),
        description: i18next.t("onboarding_menu_region_description")
      },
      on: {
        beforeStep: activate_region_selection,
      }
    },
    {
      attachTo: {
        element: '#map'
      },
      content: {
        title: i18next.t("onboarding_map_layer_title"),
        description: i18next.t("onboarding_map_layer_description")
      },
      on: {
        beforeStep: activate_region
      }
    },
    {
      attachTo: {
        element: '#menu-kind'
      },
      content: {
        title: i18next.t("onboarding_menu_kind_title"),
        description: i18next.t("onboarding_menu_kind_description")
      },
    },
    {
      attachTo: {
        element: '#menu-matrix'
      },
      content: {
        title: i18next.t("onboarding_menu_matrix_title"),
        description: i18next.t("onboarding_menu_matrix_description")
      },
      on: {
        beforeStep: () => {
          activate_region_ifneeded();
          config.kind = "matrix";
        }
      }
    },
    {
      attachTo: {
        element: '#menu-map'
      },
      content: {
        title: i18next.t("onboarding_menu_map_title"),
        description: i18next.t("onboarding_menu_map_description")
      },
      on: {
        beforeStep: activate_region_ifneeded
      }
    },
  ])

  onMounted(() => {
    new window.bootstrap.Tooltip(buttonRef.value);
    // finish();
    // start();
    // goToStep(2);
  });

</script>

<style>
  a.onboarding-button{
    font-size: x-large;
    cursor: pointer;
    color: black;
  }
  a.onboarding-button:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  [data-v-onboarding-wrapper]{
    margin-left: -5px;
    margin-right: -5px;
  }

  div.v-onboarding-item>div.v-onboarding-item__actions>button.v-onboarding-btn-primary{
    background-color: var(--bs-primary);
  }
</style>