import type { OnHomePageHandler, OnUserInputHandler } from '@metamask/snaps-sdk';
import { UserInputEventType } from '@metamask/snaps-sdk';
import { getAccount, getMyAttestations, setAttestations } from './utils';
import { showForm_AttestationDetail, showForm_AttestationListRedraw, showForm_AttestationList } from './ui';

export const onHomePage: OnHomePageHandler = async () => {
  const myAccount = await getAccount();
  const myAttestations = await getMyAttestations(myAccount);
  await setAttestations(myAttestations);

  return showForm_AttestationList();
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case 'btnBack': {
        await showForm_AttestationListRedraw(id);
        break;
      }

      default:
        await showForm_AttestationDetail(id, event.name as string);
    }
  }
}