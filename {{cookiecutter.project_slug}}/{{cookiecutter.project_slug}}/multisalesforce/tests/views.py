from unittest import mock

from ..views import (
    LoggingOAuth2CallbackView,
    LoggingOAuth2LoginView,
    SalesforceOAuth2CustomAdapter,
    SaveInstanceUrlMixin,
)


def test_SalesforceOAuth2CustomAdapter_base_url(rf):
    request = rf.get("/?custom_domain=foo")
    request.session = {}
    adapter = SalesforceOAuth2CustomAdapter(request)
    assert adapter.base_url == "https://foo.my.salesforce.com"


class TestSaveInstanceUrlMixin:
    def test_complete_login(self, mocker, rf):
        # This is a mess of terrible mocking and I do not like it.
        # This is really just to exercise the mixin, and confirm that it
        # assigns instance_url
        mocker.patch("requests.get")
        adapter = SaveInstanceUrlMixin()
        adapter.userinfo_url = None
        adapter.get_provider = mock.MagicMock()
        slfr = mock.MagicMock()
        slfr.account.extra_data = {}
        prov_ret = mock.MagicMock()
        prov_ret.sociallogin_from_response.return_value = slfr
        adapter.get_provider.return_value = prov_ret
        request = rf.get("/")
        request.session = {"socialaccount_state": (None, "some-verifier")}

        ret = adapter.complete_login(
            request, None, None, response={"instance_url": "https://example.com"}
        )
        assert ret.account.extra_data["instance_url"] == "https://example.com"


class TestLoggingOAuth2LoginView:
    def test_dispatch(self, rf, mocker):
        mocker.patch("{{cookiecutter.project_slug}}.multisalesforce.views.OAuth2LoginView.dispatch")
        logger = mocker.patch("{{cookiecutter.project_slug}}.multisalesforce.views.logger.info")
        request = rf.get("/")
        request.session = {"socialaccount_state": (None, "some-verifier")}

        LoggingOAuth2LoginView().dispatch(request)

        assert logger.called


class TestLoggingOAuth2CallbackView:
    def test_dispatch(self, rf, mocker):
        mocker.patch("{{cookiecutter.project_slug}}.multisalesforce.views.OAuth2CallbackView.dispatch")
        logger = mocker.patch("{{cookiecutter.project_slug}}.multisalesforce.views.logger.info")
        request = rf.get("/")
        request.session = {"state": "some-verifier"}

        LoggingOAuth2CallbackView().dispatch(request)

        assert logger.called
