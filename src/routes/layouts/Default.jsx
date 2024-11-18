import Header from '@/components/Header';

export default {
  name: 'Default',
  render() {
    return (
      <div class="App">
        <main class="flex flex-col items-center gap-5">
          <Header />
          <router-view />
        </main>
      </div>
    );
  },
};
