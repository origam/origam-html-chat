import {
  Overlay,
  DefaultModal,
  ModalCloseButton,
  ModalFooter,
  SimpleQuestion,
} from "../ChatApp03/components/Windows/Windows";
import React, { useState, createContext, useEffect } from "react";
import { Button } from "../ChatApp03/components/Buttons";

import { flow } from "mobx";
import { WindowsSvc } from "../ChatApp03/components/Windows/WindowsSvc";

const CtxServices = createContext<{ windowsSvc: WindowsSvc }>(null!);

export function App() {
  const [services] = useState(() => {
    return {
      windowsSvc: new WindowsSvc(),
    };
  });

  useEffect(() => {
    services.windowsSvc.push(() => (
      <DefaultModal footer={<ModalFooter align="center"></ModalFooter>}>
        <ModalCloseButton onClick={undefined} />
        <div style={{ width: 800, height: 400 }} />
      </DefaultModal>
    ));

    function openDlgQuestion01() {
      return services.windowsSvc.push<{
        isOk?: boolean;
        isCancel?: boolean;
      }>((modal) => (
        <SimpleQuestion
          message="Really?"
          onOk={() => {
            modal.resolveInteract({ isOk: true });
          }}
          onCancel={() => {
            modal.resolveInteract({ isCancel: true });
          }}
        />
      ));
    }

    function openDlgQuestion02() {
      return services.windowsSvc.push<{
        isOk?: boolean;
        isCancel?: boolean;
      }>((modal) => (
        <SimpleQuestion
          message="But arent you fucked up then?"
          onOk={() => {
            modal.resolveInteract({ isOk: true });
          }}
          onCancel={() => {
            modal.resolveInteract({ isCancel: true });
          }}
        />
      ));
    }

    async function process01() {
      const dlgQuestion01 = openDlgQuestion01();
      const result01 = await dlgQuestion01.interact();
      dlgQuestion01.close();
      if (result01?.isCancel) {
        const dlgQuestion02 = openDlgQuestion02();
        const result02 = await dlgQuestion02.interact();
        dlgQuestion02.close();
      }
    }

    process01();
  });
  return (
    <CtxServices.Provider value={services}>
      <div>{services.windowsSvc.renderStack()}</div>
    </CtxServices.Provider>
  );
}
