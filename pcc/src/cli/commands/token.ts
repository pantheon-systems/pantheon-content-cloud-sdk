import AddOnApiHelper from '../../lib/addonApiHelper';

const ID_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzNDFkZWRlZWUyZDE4NjliNjU3ZmE5MzAzMDAwODJmZTI2YjNkOTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNDI0NzAxOTE1NDEtOG8xNGo3N3B2YWdpc2M2NnM0OGtsNHViOTFmOWM3YjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNDI0NzAxOTE1NDEtOG8xNGo3N3B2YWdpc2M2NnM0OGtsNHViOTFmOWM3YjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NDc3OTA0MDc3OTgyODA2NDciLCJoZCI6InB1Ymdlbml1cy5pbyIsImVtYWlsIjoib21rYXJAcHViZ2VuaXVzLmlvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJpazBMNXQ1YlFkX3VQTDBiRGQ0alZRIiwiaWF0IjoxNjg4NzU1NDUwLCJleHAiOjE2ODg3NTkwNTB9.illrKjXyaRaGQtdLCqYk0f_eIdpJS76Xu7zFlg-xnmvbGkD7lJXHllUNxrumRj4KdHE8s97Pez0U-uYBhMFZx8FSikj_z2xc_I0g3o4cyV-mAiun4O7zK68qVDgFAwCbHiNNuq0XBHjJFswfE6RGcimgBDcgsjvzFAdHqS_IpxiXsbOboS3p1EVD8-EawvgYZVDnoRHuoLytUMlsPyFx2mdN4Fg4Ln94D0Y1U-e6Sf4RPO7Y7V3lRx3DfXRb75Vf9LOiLEkB1gayh_0MkraOShB0CnT574vTDbRVBIrpGiVYMKvy1Iz-LN1g-DBV-ubclCNLvFwt6mN1ifwunaW98A';

export const createToken = async () => {
  const apiKey = await AddOnApiHelper.createApiKey();
  console.log('111111111111', apiKey);
};
export const listTokens = async () => {
  const apiKeys = await AddOnApiHelper.listApiKeys();
  apiKeys.forEach((item) =>
    console.log('11111111', item.id, item.keyMasked, item.created),
  );
};
export const revokeToken = async (id: string) => {
  await AddOnApiHelper.revokeApiKey(id);
  console.log('1111111111Completed');
};
