import { observable, action } from "mobx";
import React, { Fragment, createContext } from "react";
import { Observer } from "mobx-react";
import { Overlay, FullscreenCentered } from "./Windows";

export interface IModalHandle<TInteractor> {
  close(): void;
  bringToFront(): void;
  interact(): Promise<TInteractor>;
  resolveInteract(interactor?: TInteractor): void;
}

export interface IWindowStackItem {
  key: any;
  render: (modal: IModalHandle<any>) => React.ReactNode;
  modalHandle: IModalHandle<any>;
}

let keyGen = 0;

export class WindowsSvc {
  @observable windowStack: IWindowStackItem[] = [];

  renderStack() {
    return (
      <Observer>
        {() => {
          const itemCnt = this.windowStack.length;
          const result: React.ReactNode[] = [];
          for (let i = 0; i < itemCnt; i++) {
            const window = this.windowStack[i];
            result.push(
              <Observer key={window.key}>
                {() => (
                  <>
                    {(() => {
                      if (i === itemCnt - 1) {
                        return (
                          <>
                            <Overlay />
                            <FullscreenCentered>
                              {window.render(window.modalHandle)}
                            </FullscreenCentered>
                          </>
                        );
                      }
                      return (
                        <FullscreenCentered>
                          {window.render(window.modalHandle)}
                        </FullscreenCentered>
                      );
                    })()}
                  </>
                )}
              </Observer>
            );
          }
          return <>{result}</>;
        }}
      </Observer>
    );
  }

  @action.bound
  push<TInteractor>(
    render: (modal: IModalHandle<TInteractor>) => React.ReactNode
  ) {
    const myKey = keyGen++;
    let fnResolveInteract: any;
    const modalHandle = {
      close: action(() => {
        const idx = this.windowStack.findIndex((item) => item.key === myKey);
        if (idx > -1) this.windowStack.splice(idx, 1);
      }),
      bringToFront: action(() => {
        const idx = this.windowStack.findIndex((item) => item.key === myKey);
        if (idx > -1) {
          const item = this.windowStack.splice(idx, 1);
          this.windowStack.push(item[0]);
        }
      }),
      resolveInteract(interactor?: TInteractor) {
        fnResolveInteract?.(interactor);
      },
      interact() {
        return new Promise<TInteractor>((resolve) => {
          fnResolveInteract = resolve;
        });
      },
    };
    this.windowStack.push({
      key: myKey,
      modalHandle,
      render,
    });
    return modalHandle as IModalHandle<TInteractor>;
  }
}
