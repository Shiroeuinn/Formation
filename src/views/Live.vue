<template>
  <Alert v-if="error" variant="danger">A problem occurred during the live.</Alert>
  <h1>{{ raceModel.name }}</h1>
  <div v-if="raceModel.status === 'FINISHED'">
    <div v-if="!winners.length">The race is over.</div>
    <div v-else>
      <Alert v-if="betWon" variant="success">You won your bet!</Alert>
      <Alert v-if="raceModel.betPonyId && !betWon" variant="warning">You lost your bet.</Alert>
      <div>Most Valuable Ponies</div>
      <div class="row">
        <div class="col" v-for="winner of winners" :key="winner.id" :class="{ selected: winner.id === raceModel.betPonyId }">
          <Pony :ponyModel="winner" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="raceModel.status === 'PENDING'">
    <p>The race will start {{ startInstant }}</p>
    <div class="row">
      <div class="col" v-for="pony of raceModel.ponies" :key="pony.id" :class="{ selected: pony.id === raceModel.betPonyId }">
        <Pony :ponyModel="pony" />
      </div>
    </div>
  </div>
  <div v-else-if="raceModel.status === 'RUNNING'">
    <div style="margin-left: 95%; margin-bottom: 5px">
      <span class="fa fa-flag" style="font-size: x-large"></span>
    </div>
    <div style="width: 95%; border-right: 3px dotted lightgray">
      <div
        v-for="pony of runningPonies"
        :key="pony.id"
        :style="{ marginLeft: `${pony.position - 5}%` }"
        :class="{ selected: pony.id === raceModel.betPonyId }"
        style="transition: all linear 1s"
      >
        <Pony :ponyModel="pony" :isRunning="true" :isBoosted="pony.boosted" @ponySelected="cheer(pony.id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Pony from '@/components/Pony.vue';
import fromNow from '@/utils/FromNow';
import { LiveRaceModel, RaceModel } from '@/models/RaceModel';
import { PonyWithPositionModel } from '@/models/PonyModel';
import { useRaceService } from '@/composables/RaceService';
import { useWsService, Connection } from '@/composables/WsService';

interface Cheer {
  ponyId: number;
  timestamp: number;
}

let connection: Connection | null = null;
onUnmounted(() => connection?.disconnect());

const raceService = useRaceService();
const route = useRoute();
const raceId = +route.params.raceId;
const raceModel = ref<RaceModel>(await raceService.get(raceId));
const startInstant = computed(() => fromNow(raceModel.value.startInstant));

const runningPonies = ref<Array<PonyWithPositionModel>>([]);
const winners = computed(() => runningPonies.value.filter(pony => pony.position >= 100));
const betWon = computed(() => raceModel.value.status === 'FINISHED' && winners.value.some(pony => pony.id === raceModel.value.betPonyId));

const wsService = useWsService();
const error = ref(false);
if (raceModel.value.status !== 'FINISHED') {
  try {
    connection = wsService.connect<LiveRaceModel>(`/race/${raceId}`, (liveRace: LiveRaceModel) => {
      runningPonies.value = liveRace.ponies;
      raceModel.value.status = liveRace.status;
      if (raceModel.value.status === 'FINISHED') {
        connection!.disconnect();
      }
    });
  } catch (e) {
    error.value = true;
  }
}

let cheersCounter: Array<Cheer> = [];
async function cheer(ponyId: number) {
  const cheer = { ponyId, timestamp: Date.now() };
  const last = cheersCounter[cheersCounter.length - 1];
  // if the pony is different than the last
  if (!last || last.ponyId !== ponyId) {
    // reset
    cheersCounter = [cheer];
    return;
  }
  // else add the cheer
  cheersCounter.push(cheer);
  // if 5 cheers
  if (cheersCounter.length >= 5) {
    const first = cheersCounter[0];
    // if in the same second
    if (cheer.timestamp - first.timestamp < 1000) {
      // boost the pony!
      cheersCounter = [];
      await raceService.boost(raceModel.value!.id, ponyId);
    } else {
      // drop the first one
      cheersCounter.splice(0, 1);
    }
  }
}
</script>

<style scoped>
.selected {
  border-left: 3px solid green;
}
</style>
