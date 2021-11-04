import { mount, RouterLinkStub } from '@vue/test-utils';
import { nextTick } from 'vue';
import Home from '@/views/Home.vue';
import { UserModel } from '@/models/UserModel';

function homeWrapper() {
  return mount(Home, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  });
}

describe('Home.vue', () => {
  test('should display every race name in a title', () => {
    const wrapper = homeWrapper();

    // You should have an `h1` element to display the title
    const title = wrapper.get('h1');
    expect(title.text()).toContain('Ponyracer');
    // You should have the `small` element inside the `h1` element
    expect(title.text()).toContain('Always a pleasure to bet on ponies');

    // You should have a `small` element to display the subtitle
    const subtitle = wrapper.get('small');
    expect(subtitle.text()).toBe('Always a pleasure to bet on ponies');
  });

  test('display a link to go the login', () => {
    const wrapper = homeWrapper();

    // You should have an `a` element to display the link to the login page
    const link = wrapper.getComponent(RouterLinkStub);
    // The link should have a text
    expect(link.text()).toBe('Login');
    // The URL of the link is not correct.
    // Maybe you forgot to use `<RouterLink to="/login">` or `<RouterLink :to="{ name: 'login' }">`?
    expect(link.props().to?.name || link.props().to).toContain('login');
  });

  test('display a link to go the register page', () => {
    const wrapper = homeWrapper();

    const link = wrapper.findAllComponents(RouterLinkStub)[1];
    // You should have an `a` element to display the link to the register page
    expect(link.exists()).toBe(true);
    // The link should have a text
    expect(link.text()).toBe('Register');
    // The URL of the link is not correct.
    // Maybe you forgot to use `<RouterLink to="/register">` or `<RouterLink :to="{ name: 'register' }">`?
    expect(link.props().to?.name || link.props().to).toContain('register');
  });

  test('display a link to go the races page if the user is logged in', async () => {
    const wrapper = homeWrapper();

    // if the user is logged in
    (wrapper.vm as unknown as { userModel: UserModel }).userModel = {
      login: 'cedric',
      money: 200,
      birthYear: 1986,
      password: ''
    } as UserModel;
    await nextTick();

    const links = wrapper.findAllComponents(RouterLinkStub);
    // You should have only one link to the races when user is logged in
    expect(links).toHaveLength(1);
    const link = links[0];
    // You should have an `a` element to display the link to the races page
    expect(link.exists()).toBe(true);
    // The link should have a text
    expect(link.text()).toBe('Races');
    // The URL of the link is not correct.
    // Maybe you forgot to use `<RouterLink to="/races">` or `<RouterLink :to="{ name: 'races' }">`?
    expect(link.props().to?.name || link.props().to).toContain('races');
  });
});
