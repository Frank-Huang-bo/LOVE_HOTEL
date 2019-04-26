<template>
    <div>
        <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
            <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
              <i class="fas fa-heart fa-1x mr-1"></i>
              LOVE HOTEL
            </a>
            <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
            <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap">
                <a class="nav-link" href="#" @click.prevent="signout">Sign out</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      this.$http.post(api).then((response) => {
        console.log(response.data, vm)
        if(response.data.success){
          vm.$router.push('/login');
        }
      })
    }
  }
}
</script>