import { ChatLog } from "./ChatLog"

describe("ChatLog", () => {
  it("retains freshly loaded items in sorted form", () => {
    const cl = new ChatLog();

    cl.setItems([
      {clientOrder: 1, serverOrder: 1, id: 'a'} as any,
      {clientOrder: 3, serverOrder: 1, id: 'a'} as any,
      {clientOrder: 9, serverOrder: 1, id: 'a'} as any,
      {clientOrder: 2, serverOrder: 1, id: 'a'} as any,

    ])
  })
})