<script setup>
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { contactSchema } from '~/schemas/contact.js'

const { t } = useI18n()
const { locale } = useI18n()
const toast = useToast()
const sent = ref(false)
const submitting = ref(false)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: { position: '', ctaContext: 'evaluacion', consent: false },
})

const { value: name, errorMessage: eName } = useField('name')
const { value: lastName, errorMessage: eLast } = useField('lastName')
const { value: position } = useField('position')
const { value: company, errorMessage: eCompany } = useField('company')
const { value: sector, errorMessage: eSector } = useField('sector')
const { value: email, errorMessage: eEmail } = useField('email')
const { value: message, errorMessage: eMessage } = useField('message')
const { value: ctaContext } = useField('ctaContext')
const { value: consent, errorMessage: eConsent } = useField('consent')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...values, locale: locale.value } })
    sent.value = true
    toast.success(t('contact.success'))
  } catch (e) {
    toast.error(t('contact.error'))
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="form-panel">
    <div v-if="sent" class="center" style="padding:var(--space-6) 0">
      <span class="kicker">✓</span>
      <h3>{{ t('contact.success') }}</h3>
    </div>
    <form v-else novalidate @submit.prevent="onSubmit">
      <p class="muted" style="margin-bottom:var(--space-5)">{{ t('contact.required') }}</p>
      <div class="form-grid">
        <div class="form-field">
          <label for="f-name">{{ t('contact.name') }} <span class="req">*</span></label>
          <input id="f-name" v-model="name" type="text" maxlength="60" autocomplete="given-name">
          <span v-if="eName" class="field-error">{{ eName }}</span>
        </div>
        <div class="form-field">
          <label for="f-last">{{ t('contact.lastName') }} <span class="req">*</span></label>
          <input id="f-last" v-model="lastName" type="text" maxlength="60" autocomplete="family-name">
          <span v-if="eLast" class="field-error">{{ eLast }}</span>
        </div>
        <div class="form-field">
          <label for="f-position">{{ t('contact.position') }}</label>
          <input id="f-position" v-model="position" type="text" maxlength="80">
        </div>
        <div class="form-field">
          <label for="f-company">{{ t('contact.company') }} <span class="req">*</span></label>
          <input id="f-company" v-model="company" type="text" maxlength="100" autocomplete="organization">
          <span v-if="eCompany" class="field-error">{{ eCompany }}</span>
        </div>
        <div class="form-field">
          <label for="f-sector">{{ t('contact.sector') }} <span class="req">*</span></label>
          <select id="f-sector" v-model="sector">
            <option value="" disabled>{{ t('contact.selectSector') }}</option>
            <option value="salud">{{ t('sectors.salud') }}</option>
            <option value="hoteleria">{{ t('sectors.hoteleria') }}</option>
            <option value="industria">{{ t('sectors.industria') }}</option>
            <option value="mineria">{{ t('sectors.mineria') }}</option>
            <option value="otro">{{ t('contact.other') }}</option>
          </select>
          <span v-if="eSector" class="field-error">{{ eSector }}</span>
        </div>
        <div class="form-field">
          <label for="f-email">{{ t('contact.email') }} <span class="req">*</span></label>
          <input id="f-email" v-model="email" type="email" maxlength="120" autocomplete="email">
          <span v-if="eEmail" class="field-error">{{ eEmail }}</span>
        </div>
        <div class="form-field full">
          <label for="f-type">{{ t('contact.requestType') }}</label>
          <select id="f-type" v-model="ctaContext">
            <option value="evaluacion">{{ $t('cta.evaluation') }}</option>
            <option value="diagnostico">{{ $t('cta.diagnosis') }}</option>
          </select>
        </div>
        <div class="form-field full">
          <label for="f-message">{{ t('contact.message') }} <span class="req">*</span></label>
          <textarea id="f-message" v-model="message" maxlength="1200" />
          <span v-if="eMessage" class="field-error">{{ eMessage }}</span>
        </div>
        <div class="form-check">
          <input id="f-consent" v-model="consent" type="checkbox">
          <label for="f-consent">{{ t('contact.consent') }} <span class="req">*</span></label>
        </div>
        <div v-if="eConsent" class="form-field full"><span class="field-error">{{ eConsent }}</span></div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? t('contact.sending') : t('contact.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>
