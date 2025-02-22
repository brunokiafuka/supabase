import semver from 'semver'
import { FC } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Typography } from '@supabase/ui'
import { AutoField, LongTextField } from 'uniforms-bootstrap4'

import { API_URL } from 'lib/constants'
import { useProjectAuthConfig } from 'hooks'
import { pluckJsonSchemaFields } from 'lib/helpers'
import { patch } from 'lib/common/fetch'
import { authConfig } from 'stores/jsonSchema'
import SchemaFormPanel from 'components/to-be-cleaned/forms/SchemaFormPanel'

const Templates: FC<any> = ({ project }) => {
  const router = useRouter()
  const magicLinkEnable = semver.gte(
    // @ts-ignore
    semver.coerce(toJS(project?.kpsVersion) || 'kps-v0.0.1'),
    semver.coerce('kps-v2.5.3')
  )

  const { config, error, mutateAuthConfig } = useProjectAuthConfig(project.ref)
  if (error) {
    return (
      <Typography.Text type="danger">
        <p>Error connecting to API</p>
        <p>{`${error}`}</p>
      </Typography.Text>
    )
  }

  let model: any = { ...config }

  const onFormSubmit = async (model: any) => {
    const response = await patch(`${API_URL}/auth/${router.query.ref}/config`, model)
    if (response.error) {
      toast.error(`Update config failed: ${response.error.message}`)
    } else {
      mutateAuthConfig(response)
      toast(`Settings saved`)
    }
  }

  return (
    <div className="">
      <div className="my-8 mt-0">
        <SchemaFormPanel
          title="SMS Message"
          schema={pluckJsonSchemaFields(authConfig, ['SMS_TEMPLATE'])}
          model={{
            SMS_TEMPLATE: model.SMS_TEMPLATE,
          }}
          onSubmit={(model: any) => onFormSubmit(model)}
        >
          <AutoField
            name="SMS_TEMPLATE"
            showInlineError
            inputClassName="font-mono"
            errorMessage="Please enter an sms body."
          />
        </SchemaFormPanel>
      </div>
      <div className="my-8">
        <SchemaFormPanel
          title="Confirm Signup"
          schema={pluckJsonSchemaFields(authConfig, [
            'MAILER_SUBJECTS_CONFIRMATION',
            'MAILER_TEMPLATES_CONFIRMATION_CONTENT',
          ])}
          model={{
            MAILER_SUBJECTS_CONFIRMATION: model.MAILER_SUBJECTS_CONFIRMATION,
            MAILER_TEMPLATES_CONFIRMATION_CONTENT: model.MAILER_TEMPLATES_CONFIRMATION_CONTENT,
          }}
          onSubmit={(model: any) => onFormSubmit(model)}
        >
          <AutoField
            name="MAILER_SUBJECTS_CONFIRMATION"
            showInlineError
            errorMessage="Please enter a subject."
          />
          <LongTextField
            name="MAILER_TEMPLATES_CONFIRMATION_CONTENT"
            rows={6}
            showInlineError
            inputClassName="font-mono"
            errorMessage="Please enter an email body."
          />
        </SchemaFormPanel>
      </div>
      <div className="my-8">
        <SchemaFormPanel
          title="Reset password"
          schema={pluckJsonSchemaFields(authConfig, [
            'MAILER_SUBJECTS_RECOVERY',
            'MAILER_TEMPLATES_RECOVERY_CONTENT',
          ])}
          model={{
            MAILER_SUBJECTS_RECOVERY: model.MAILER_SUBJECTS_RECOVERY,
            MAILER_TEMPLATES_RECOVERY_CONTENT: model.MAILER_TEMPLATES_RECOVERY_CONTENT,
          }}
          onSubmit={(model: any) => onFormSubmit(model)}
        >
          <AutoField
            name="MAILER_SUBJECTS_RECOVERY"
            showInlineError
            errorMessage="Please enter a subject."
          />
          <LongTextField
            name="MAILER_TEMPLATES_RECOVERY_CONTENT"
            rows={6}
            showInlineError
            inputClassName="font-mono"
            errorMessage="Please enter an email body."
          />
        </SchemaFormPanel>
      </div>
      {magicLinkEnable && (
        <div className="my-8">
          <SchemaFormPanel
            title="Magic Link"
            schema={pluckJsonSchemaFields(authConfig, [
              'MAILER_SUBJECTS_MAGIC_LINK',
              'MAILER_TEMPLATES_MAGIC_LINK_CONTENT',
            ])}
            model={{
              MAILER_SUBJECTS_MAGIC_LINK: model.MAILER_SUBJECTS_MAGIC_LINK,
              MAILER_TEMPLATES_MAGIC_LINK_CONTENT: model.MAILER_TEMPLATES_MAGIC_LINK_CONTENT,
            }}
            onSubmit={(model: any) => onFormSubmit(model)}
          >
            <AutoField
              name="MAILER_SUBJECTS_MAGIC_LINK"
              showInlineError
              errorMessage="Please enter a subject."
            />
            <LongTextField
              name="MAILER_TEMPLATES_MAGIC_LINK_CONTENT"
              rows={6}
              showInlineError
              inputClassName="font-mono"
              errorMessage="Please enter an email body."
            />
          </SchemaFormPanel>
        </div>
      )}
      <div className="my-8">
        <SchemaFormPanel
          title="Change email address"
          schema={pluckJsonSchemaFields(authConfig, [
            'MAILER_SUBJECTS_EMAIL_CHANGE',
            'MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT',
          ])}
          model={{
            MAILER_SUBJECTS_EMAIL_CHANGE: model.MAILER_SUBJECTS_EMAIL_CHANGE,
            MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT: model.MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT,
          }}
          onSubmit={(model: any) => onFormSubmit(model)}
        >
          <AutoField
            name="MAILER_SUBJECTS_EMAIL_CHANGE"
            showInlineError
            errorMessage="Please enter a subject."
          />
          <LongTextField
            name="MAILER_TEMPLATES_EMAIL_CHANGE_CONTENT"
            rows={6}
            showInlineError
            inputClassName="font-mono"
            errorMessage="Please enter an email body."
          />
        </SchemaFormPanel>
      </div>
      <div className="my-8">
        <SchemaFormPanel
          title="Invite user"
          schema={pluckJsonSchemaFields(authConfig, [
            'MAILER_SUBJECTS_INVITE',
            'MAILER_TEMPLATES_INVITE_CONTENT',
          ])}
          model={{
            MAILER_SUBJECTS_INVITE: model.MAILER_SUBJECTS_INVITE,
            MAILER_TEMPLATES_INVITE_CONTENT: model.MAILER_TEMPLATES_INVITE_CONTENT,
          }}
          onSubmit={(model: any) => onFormSubmit(model)}
        >
          <AutoField
            name="MAILER_SUBJECTS_INVITE"
            showInlineError
            errorMessage="Please enter a subject."
          />
          <LongTextField
            name="MAILER_TEMPLATES_INVITE_CONTENT"
            rows={6}
            showInlineError
            inputClassName="font-mono"
            errorMessage="Please enter an email body."
          />
        </SchemaFormPanel>
      </div>
    </div>
  )
}

export default observer(Templates)
