import requests

from allauth.socialaccount.providers.oauth2.views import (
    OAuth2CallbackView,
    OAuth2LoginView,
)
from allauth.socialaccount.providers.salesforce.views import (
    SalesforceOAuth2Adapter as SalesforceOAuth2BaseAdapter
)

from .provider import (
    SalesforceProductionProvider,
    SalesforceTestProvider,
    SalesforceCustomProvider,
)


class SaveInstanceUrlMixin:
    def complete_login(self, request, app, token, **kwargs):
        resp = requests.get(self.userinfo_url, params={'oauth_token': token})
        resp.raise_for_status()
        extra_data = resp.json()
        instance_url = kwargs.get('response', {}).get('instance_url', None)
        ret = self.get_provider().sociallogin_from_response(
            request,
            extra_data,
        )
        ret.account.extra_data['instance_url'] = instance_url
        return ret


class SalesforceOAuth2ProductionAdapter(
        SaveInstanceUrlMixin, SalesforceOAuth2BaseAdapter):
    provider_id = SalesforceProductionProvider.id


class SalesforceOAuth2SandboxAdapter(
        SaveInstanceUrlMixin, SalesforceOAuth2BaseAdapter):
    provider_id = SalesforceTestProvider.id


class SalesforceOAuth2CustomAdapter(
        SaveInstanceUrlMixin, SalesforceOAuth2BaseAdapter):
    provider_id = SalesforceCustomProvider.id

    @property
    def base_url(self):
        custom_domain = self.request.GET.get(
            'custom_domain',
            self.request.session.get('custom_domain'),
        )
        self.request.session['custom_domain'] = custom_domain
        return 'https://{}.my.salesforce.com'.format(custom_domain)


prod_oauth2_login = OAuth2LoginView.adapter_view(
    SalesforceOAuth2ProductionAdapter,
)
prod_oauth2_callback = OAuth2CallbackView.adapter_view(
    SalesforceOAuth2ProductionAdapter,
)
sandbox_oauth2_login = OAuth2LoginView.adapter_view(
    SalesforceOAuth2SandboxAdapter,
)
sandbox_oauth2_callback = OAuth2CallbackView.adapter_view(
    SalesforceOAuth2SandboxAdapter,
)
custom_oauth2_login = OAuth2LoginView.adapter_view(
    SalesforceOAuth2CustomAdapter,
)
custom_oauth2_callback = OAuth2CallbackView.adapter_view(
    SalesforceOAuth2CustomAdapter,
)
