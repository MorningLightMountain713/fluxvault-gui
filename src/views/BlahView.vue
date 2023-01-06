<template>
    <v-container fill-height fluid>
        <v-row>
            <v-col>
                <div class="text-h1">We building a device here</div>
                <v-btn color="accent" large @click.stop="showDialog = true">Big Button</v-btn>
                <Dialog v-model="showDialog" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Dialog from "@/components/Dialog.vue";
export default {
    data() {
        return {
            showDialog: false,
        }
    },
    components: {
        Dialog
    }
}</script>
