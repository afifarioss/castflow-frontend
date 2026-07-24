// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AdRegistry {
    struct Slot {
        address creator;
        uint256 price;
        string description;
        bool active;
    }

    mapping(uint256 => Slot) public slots;
    uint256 public nextSlotId;

    event SlotListed(uint256 indexed slotId, address indexed creator, uint256 price, string description);
    event SlotDeactivated(uint256 indexed slotId);

    function listSlot(uint256 price, string calldata description) external returns (uint256 slotId) {
        require(price > 0, "Price must be > 0");
        slotId = nextSlotId++;
        slots[slotId] = Slot({
            creator: msg.sender,
            price: price,
            description: description,
            active: true
        });
        emit SlotListed(slotId, msg.sender, price, description);
    }

    function deactivateSlot(uint256 slotId) external {
        Slot storage slot = slots[slotId];
        require(slot.creator == msg.sender, "Not slot owner");
        require(slot.active, "Already inactive");
        slot.active = false;
        emit SlotDeactivated(slotId);
    }

    function getSlot(uint256 slotId) external view returns (Slot memory) {
        return slots[slotId];
    }
}
