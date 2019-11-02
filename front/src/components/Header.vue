<template>
    <header class="header">
        <h3 class="title">Camagru</h3>
        <button class="config-btn">
            <i class="material-icons">settings</i>
        </button>
        <button class="logout-btn" @click="$store.commit('logout')">
            <i class="material-icons">logout</i>
        </button>
    </header>
</template>
