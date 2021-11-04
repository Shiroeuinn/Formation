<template>
  <div>
    <h2>{{ raceModel.name }}</h2>
    <p>{{ startInstant }}</p>
    <div class="row">
      <div class="col" v-for="pony in raceModel.ponies" :key="pony.id">
        <Pony :ponyModel="pony" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RaceModel } from '@/models/RaceModel';
import fromNow from '@/utils/FromNow';
import Pony from '@/components/Pony.vue';

const props = defineProps<{
  raceModel: RaceModel;
}>();

const startInstant = computed(() => fromNow(props.raceModel.startInstant));
</script>
