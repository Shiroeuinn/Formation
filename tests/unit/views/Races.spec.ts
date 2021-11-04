import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils';
import { defineComponent } from 'vue';
import Races from '@/views/Races.vue';
import Race from '@/components/Race.vue';
import { RaceModel } from '@/models/RaceModel';

const mockRaceService = {
  list: jest.fn()
};
jest.mock('@/composables/RaceService', () => ({
  useRaceService: () => mockRaceService
}));

const AsyncWrapper = defineComponent({
  components: { Races },
  template: `<Suspense><Races/></Suspense>`
});

describe('Races.vue', () => {
  test('should display every race name in a title', async () => {
    mockRaceService.list.mockResolvedValue([
      { name: 'London', startInstant: '2020-02-18T08:02:00Z' },
      { name: 'New York', startInstant: '2020-02-18T08:03:00Z' }
    ] as Array<RaceModel>);
    const asyncWrapper = mount(AsyncWrapper, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await flushPromises();

    const wrapper = asyncWrapper.findComponent(Races);
    const raceComponents = wrapper.findAllComponents(Race);
    // You should have a `Race` component per race in your template
    expect(raceComponents).toHaveLength(2);

    // You should have a `RouterLink` per race to go to the bet page
    const links = asyncWrapper.findAll('.btn-primary');
    expect(links).toHaveLength(2);
    expect(links[0].text()).toBe('Bet on London');
  });
});
