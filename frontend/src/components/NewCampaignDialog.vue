<script setup lang="ts">
import { reactive, ref, useId, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext';
import { api } from '../services/api';

const visible = defineModel<boolean>({ default: false });

const emit = defineEmits<{
    saved: [];
}>();

const uid = useId();
const formId = `form-new-campaign-${uid}`;
const idName = `new-campaign-name-${uid}`;
const idCost = `new-campaign-cost-${uid}`;
const idRevenue = `new-campaign-revenue-${uid}`;
const idTax = `new-campaign-tax-${uid}`;
const idExpense = `new-campaign-expense-${uid}`;

const form = reactive({
    name: '',
    cost: 0,
    revenue: 0,
    tax: 0,
    expense: 0,
});

const isSaveLoading = ref(false);
const formError = ref('');

function resetForm() {
    Object.assign(form, { name: '', cost: 0, revenue: 0, tax: 0, expense: 0 });
    formError.value = '';
}

watch(visible, (open) => {
    if (open) {
        resetForm();
    }
});

function clampMoney(key: 'cost' | 'revenue' | 'tax' | 'expense') {
    const v = form[key];
    form[key] = typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0;
}

async function handleSubmit() {
    const name = form.name.trim();
    if (!name) {
        formError.value = 'Informe o nome da campanha.';
        return;
    }
    if ((form.cost <= 0)) {
        formError.value = 'O custo deve ser maior que zero.';
        return;
    }
    if ((form.revenue <= 0)) {
        formError.value = 'A receita deve ser maior que zero.';
        return;
    }

    try {
        isSaveLoading.value = true;
        formError.value = '';
        await api.post('/campaigns', { ...form, name });
        visible.value = false;
        resetForm();
        emit('saved');
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        formError.value = err.response?.data?.error ?? 'Erro ao salvar campanha.';
    } finally {
        isSaveLoading.value = false;
    }
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Nova Campanha"
        :style="{ width: '30rem' }"
    >
        <Message v-if="formError" severity="error" class="dialog-form-message">{{ formError }}</Message>

        <form :id="formId" class="form-grid" @submit.prevent="handleSubmit">
            <div class="field">
                <label class="field-label" :for="idName">Nome da Campanha <span class="req-star" aria-hidden="true">*</span></label>
                <InputText
                    :id="idName"
                    v-model="form.name"
                    fluid
                    autocomplete="off"
                    placeholder="Ex: Black Friday 2024"
                    aria-required="true"
                />
            </div>

            <div class="flex-row">
                <div class="field half">
                    <label class="field-label" :for="idCost">Custo (R$) <span class="req-star" aria-hidden="true">*</span></label>
                    <input
                        :id="idCost"
                        v-model.number="form.cost"
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        inputmode="decimal"
                        class="p-inputtext p-component p-inputtext-fluid money-input"
                        @blur="clampMoney('cost')"
                    />
                </div>
                <div class="field half">
                    <label class="field-label" :for="idRevenue">Receita (R$) <span class="req-star" aria-hidden="true">*</span></label>
                    <input
                        :id="idRevenue"
                        v-model.number="form.revenue"
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        inputmode="decimal"
                        class="p-inputtext p-component p-inputtext-fluid money-input"
                        @blur="clampMoney('revenue')"
                    />
                </div>
            </div>

            <div class="flex-row">
                <div class="field half">
                    <label class="field-label" :for="idTax">Taxas (R$)</label>
                    <input
                        :id="idTax"
                        v-model.number="form.tax"
                        type="number"
                        min="0"
                        step="0.01"
                        class="p-inputtext p-component p-inputtext-fluid money-input"
                        @blur="clampMoney('tax')"
                    />
                </div>
                <div class="field half">
                    <label class="field-label" :for="idExpense">Despesas (R$)</label>
                    <input
                        :id="idExpense"
                        v-model.number="form.expense"
                        type="number"
                        min="0"
                        step="0.01"
                        class="p-inputtext p-component p-inputtext-fluid money-input"
                        @blur="clampMoney('expense')"
                    />
                </div>
            </div>
        </form>

        <template #footer>
            <Button label="Cancelar" type="button" text severity="secondary" @click="visible = false" />
            <Button
                label="Salvar Campanha"
                type="submit"
                :form="formId"
                :loading="isSaveLoading"
            />
        </template>
    </Dialog>
</template>

<style scoped>
.dialog-form-message {
    margin-bottom: 1rem;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.flex-row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
}

.field-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-muted-color, var(--p-text-secondary-color, #64748b));
}

.half {
    flex: 1;
    min-width: 0;
}

.money-input {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.req-star {
    color: var(--p-red-500, #ef4444);
    font-weight: 700;
}
</style>
