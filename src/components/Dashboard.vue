<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <Navbar></Navbar>
        <Alert></Alert>
        <div class="container-fluid">
            <div class="row">
                <Sidebar></Sidebar>
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Sidebar from "./Sidebar.vue";
import Alert from "./AlertMessage.vue";

export default {
    components: {
        Navbar,
        Sidebar,
        Alert
    },
    computed: {
        isLoading(){
            return this.$store.state.isLoading;
        }
    }
}

</script>