<template>
    <b-navbar toggleable="lg" type="light" variant="light" class="border-bottom">
        <b-container>
            <b-navbar-brand to="/" class="font-weight-bold" style="font-size: 1.5rem;">
                DiangX
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"/>

            <b-collapse is-nav id="nav-collapse">
                <b-navbar-nav>
                    <b-nav-item to="/home">Home</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav>
                    <b-nav-item to="/post">Blog</b-nav-item>
                </b-navbar-nav>
                <!-- <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right>
                        <template #button-content>v2.23.1</template>
                        <b-dropdown-item to="/latest">Latest (v2.23.1)</b-dropdown-item>
                        <b-dropdown-item to="/changelog">Changelog</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav> -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item href="https://github.com/diangx" target="_blank">
                        <b-icon-github font-scale="1.2"/>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>
</template>
