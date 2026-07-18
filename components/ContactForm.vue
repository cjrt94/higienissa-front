<script setup>
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { contactSchema } from '~/schemas/contact.js'

const { t } = useI18n()
const { locale } = useI18n()
const toast = useToast()
const sent = ref(false)
const submitting = ref(false)
const successEl = ref(null)

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

const msgLen = computed(() => (message.value || '').length)

// id del campo por nombre de error → para llevar el foco al primer campo inválido
const FIELD_ID = { name: 'f-name', lastName: 'f-last', company: 'f-company', sector: 'f-sector', email: 'f-email', message: 'f-message', consent: 'f-consent' }

const onValid = async (values) => {
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
}
const onInvalid = ({ errors }) => {
  const first = Object.keys(errors)[0]
  const id = FIELD_ID[first]
  if (id && typeof document !== 'undefined') document.getElementById(id)?.focus()
}
const onSubmit = handleSubmit(onValid, onInvalid)

// Al enviarse con éxito, llevar el foco al bloque de confirmación (teclado + lectores)
watch(sent, (v) => {
  if (v) nextTick(() => successEl.value?.focus())
})
</script>

<template>
  <div class="form-panel">
    <div
      v-if="sent" ref="successEl" class="form-success"
      role="status" aria-live="polite" tabindex="-1"
    >
      <span class="fs-badge" aria-hidden="true"><BaseIcon name="check" :size="30" /></span>
      <h3>{{ t('contact.success') }}</h3>
      <p>{{ t('contact.successBody') }}</p>
      <BaseButton to="/" variant="ghost">{{ t('contact.backHome') }}</BaseButton>
    </div>
    <form v-else novalidate @submit.prevent="onSubmit">
      <p class="muted" style="margin-bottom:var(--space-5)">{{ t('contact.required') }}</p>
      <div class="form-grid">
        <div class="form-field">
          <label for="f-name">{{ t('contact.name') }} <span class="req">*</span></label>
          <input id="f-name" v-model="name" type="text" maxlength="60" autocomplete="given-name"
                 :aria-invalid="!!eName" :aria-describedby="eName ? 'e-name' : undefined">
          <span v-if="eName" id="e-name" class="field-error" role="alert">{{ eName }}</span>
        </div>
        <div class="form-field">
          <label for="f-last">{{ t('contact.lastName') }} <span class="req">*</span></label>
          <input id="f-last" v-model="lastName" type="text" maxlength="60" autocomplete="family-name"
                 :aria-invalid="!!eLast" :aria-describedby="eLast ? 'e-last' : undefined">
          <span v-if="eLast" id="e-last" class="field-error" role="alert">{{ eLast }}</span>
        </div>
        <div class="form-field">
          <label for="f-position">{{ t('contact.position') }}</label>
          <input id="f-position" v-model="position" type="text" maxlength="80">
        </div>
        <div class="form-field">
          <label for="f-company">{{ t('contact.company') }} <span class="req">*</span></label>
          <input id="f-company" v-model="company" type="text" maxlength="100" autocomplete="organization"
                 :aria-invalid="!!eCompany" :aria-describedby="eCompany ? 'e-company' : undefined">
          <span v-if="eCompany" id="e-company" class="field-error" role="alert">{{ eCompany }}</span>
        </div>
        <div class="form-field">
          <label for="f-sector">{{ t('contact.sector') }} <span class="req">*</span></label>
          <select id="f-sector" v-model="sector"
                  :aria-invalid="!!eSector" :aria-describedby="eSector ? 'e-sector' : undefined">
            <option value="" disabled>{{ t('contact.selectSector') }}</option>
            <option value="salud">{{ t('sectors.salud') }}</option>
            <option value="hoteleria">{{ t('sectors.hoteleria') }}</option>
            <option value="industria">{{ t('sectors.industria') }}</option>
            <option value="mineria">{{ t('sectors.mineria') }}</option>
            <option value="otro">{{ t('contact.other') }}</option>
          </select>
          <span v-if="eSector" id="e-sector" class="field-error" role="alert">{{ eSector }}</span>
        </div>
        <div class="form-field">
          <label for="f-email">{{ t('contact.email') }} <span class="req">*</span></label>
          <input id="f-email" v-model="email" type="email" maxlength="120" autocomplete="email"
                 :aria-invalid="!!eEmail" :aria-describedby="eEmail ? 'e-email' : undefined">
          <span v-if="eEmail" id="e-email" class="field-error" role="alert">{{ eEmail }}</span>
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
          <textarea id="f-message" v-model="message" maxlength="1200"
                    :aria-invalid="!!eMessage" :aria-describedby="eMessage ? 'e-message' : undefined" />
          <span class="char-count" aria-hidden="true">{{ msgLen }}/1200</span>
          <span v-if="eMessage" id="e-message" class="field-error" role="alert">{{ eMessage }}</span>
        </div>
        <div class="form-check">
          <input id="f-consent" v-model="consent" type="checkbox"
                 :aria-invalid="!!eConsent" :aria-describedby="eConsent ? 'e-consent' : undefined">
          <label for="f-consent">{{ t('contact.consent') }} <span class="req">*</span></label>
          <span v-if="eConsent" id="e-consent" class="field-error" role="alert">{{ eConsent }}</span>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" type="submit" :disabled="submitting">
          <span v-if="submitting" class="btn-spinner" aria-hidden="true" />
          {{ submitting ? t('contact.sending') : t('contact.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>
