import {
  AutoCenter,
  Badge,
  Button,
  DatePicker,
  Dialog,
  DotLoading,
  FloatingBubble,
  Form,
  InfiniteScroll,
  Input,
  List,
  Popup,
  PullToRefresh,
  Selector,
  SwipeAction,
  Switch,
  Toast,
} from "antd-mobile";
import {
  AddCircleOutline,
  AddOutline,
  GiftOutline,
  MessageFill,
} from "antd-mobile-icons";
import { FormInstance } from "antd-mobile/es/components/form";
import {
  addDoc,
  collection,
  getDocs,
  CollectionReference,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  FoodItemEntity,
  FoodItemsPaginationInput,
  FoodItemsQueryResult,
  FoodItemStatus,
  LocationQueryResult,
  Location,
} from "./interface";
import dayjs from "dayjs";

export function FoodPage() {
  const addFoodItemFormRef = React.useRef<FormInstance>(null);
  const updateFoodItemFormRef = React.useRef<FormInstance>(null);
  const [foodItemUpdate, setFoodItemUpdate] = useState<FoodItemEntity | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [addFoodItemVisible, setAddFoodItemVisible] = useState(false);
  const [updateFoodItemVisible, setUpdateFoodItemVisible] = useState(false);
  const [dateEndVisible, setDateEndVisible] = useState(false);
  const [dataSource, setDataSource] = useState<FoodItemEntity[]>([]);
  const [queryPagination, setQueryPagination] =
    useState<FoodItemsPaginationInput>({
      take: 10,
    });
  let foodItemForUpdate: FoodItemEntity | null = null;
  const [isUpdatingFoodItem, setIsUpdatingFoodItem] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  /**
   *
   */
  const getLocation = async () => {
    const querySnapshot = await getDocs(
      collection(db, "locations") as CollectionReference<Location>
    );
    const result: Location[] = [];
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, name: doc.data().name });
    });
    setLocations(result);
  };
  const getFoods = async () => {
    const querySnapshot = await getDocs(
      collection(db, "foods") as CollectionReference<FoodItemEntity>
    );
    const result: FoodItemEntity[] = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      console.log(item);
      result.push({
        id: doc.id,
        name: item.name,
        dateEnd: item.dateEnd,
        location: item.location,
        status: "",
      });
    });
    setDataSource(result);
  };
  useEffect(() => {
    getLocation();
    getFoods();
  }, []);
  /**
   * If isUpdatingFoodItem is true, then we are updating a food item
   * We open popup and form to update food item
   */
  useEffect(() => {
    if (isUpdatingFoodItem) {
      setUpdateFoodItemVisible(true);
      updateFoodItemFormRef.current?.resetFields();
    } else {
      setUpdateFoodItemVisible(false);
      updateFoodItemFormRef.current?.resetFields();
    }
  }, [isUpdatingFoodItem]);

  async function loadMore(pagination?: FoodItemsPaginationInput) {
    if (pagination) {
      setQueryPagination(pagination);
    } else {
      setQueryPagination({
        ...queryPagination,
        skip: dataSource.length,
      });
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <FloatingBubble
        style={{
          "--initial-position-bottom": "75px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={async () => {
          setAddFoodItemVisible(true);
        }}
      >
        <AddCircleOutline fontSize={28} />
      </FloatingBubble>
      {/**
       * BEGIN form add food item
       */}
      <Popup
        visible={addFoodItemVisible}
        onMaskClick={() => {
          setAddFoodItemVisible(false);
        }}
        bodyStyle={{}}
      >
        <Form
          ref={addFoodItemFormRef}
          footer={
            <Button block type="submit" color="primary" size="large">
              Save
            </Button>
          }
          onFinish={async (values: {
            name: string;
            locationId: string;
            dateEnd: string;
          }) => {
            Toast.show({
              icon: "loading",
              content: "Loading...",
            });
            try {
              const docRef = await addDoc(collection(db, "foods"), values);
              console.log("Document written with ID: ", docRef.id);
              Toast.show({
                icon: "success",
              });
              setAddFoodItemVisible(false);
            } catch (e) {
              Toast.show({
                icon: "fail",
                content: "error",
              });
              console.error("Error adding document: ", e);
            }
          }}
        >
          <Form.Header>Add Food Items</Form.Header>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Name of food" autoComplete="false" />
          </Form.Item>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true }]}
          >
            <Selector
              options={locations.map((location) => {
                return {
                  label: location.name,
                  value: location.id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="Date End"
            trigger="onConfirm"
            onClick={() => {
              setDateEndVisible(true);
            }}
            rules={[{ required: true }]}
          >
            <DatePicker
              visible={dateEndVisible}
              onClose={() => {
                setDateEndVisible(false);
              }}
            >
              {(value) => {
                return value?.toLocaleDateString() ?? "";
              }}
            </DatePicker>
          </Form.Item>
        </Form>
      </Popup>
      {/**
       * END form add food item
       */}

      {/**
       * BEGIN form update food item
       */}
      <Popup
        visible={updateFoodItemVisible}
        onMaskClick={() => {
          setIsUpdatingFoodItem(false);
          setFoodItemUpdate(null);
          updateFoodItemFormRef.current?.resetFields();
        }}
      >
        <Form
          ref={updateFoodItemFormRef}
          footer={
            <Button block type="submit" color="primary" size="large">
              Save
            </Button>
          }
          onFinishFailed={(error) => {
            console.log(error);
          }}
          onFinish={async (values: any) => {
            console.log(values);

            Toast.show({
              icon: "loading",
              content: "Loading...",
            });
          }}
        >
          <Form.Header>
            Update Food Item {foodItemUpdate ? foodItemUpdate.name ?? "" : ""}
          </Form.Header>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
            initialValue={foodItemUpdate?.name}
          >
            <Input
              placeholder="Name of food"
              autoComplete="false"
              value={foodItemUpdate?.name}
            />
          </Form.Item>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true }]}
            initialValue={[foodItemUpdate?.location?.id]}
          >
            <Selector options={[]} />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="Date End"
            trigger="onConfirm"
            onClick={() => {
              setDateEndVisible(true);
            }}
            rules={[{ required: true }]}
            initialValue={new Date(foodItemUpdate?.dateEnd?.seconds ?? "")}
          >
            <DatePicker
              visible={dateEndVisible}
              onClose={() => {
                setDateEndVisible(false);
              }}
            >
              {(value) => {
                return value?.toLocaleDateString() ?? "";
              }}
            </DatePicker>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue={foodItemUpdate?.status === "EATEN"}
          >
            <Switch defaultChecked={foodItemUpdate?.status === "EATEN"} />
          </Form.Item>
        </Form>
      </Popup>

      {/**
       * END form update food item
       */}

      {/**
       * Hiển thị danh sách food items
       */}
      <PullToRefresh
        onRefresh={async () => {
          setQueryPagination({
            ...queryPagination,
            skip: 0,
          });
        }}
        pullingText="Pull to refresh"
        refreshingText="Refreshing..."
        completeText="Refresh complete"
        canReleaseText="Release to refresh"
      >
        <List header="Food Items" style={{ width: "100%" }}>
          {dataSource?.map((item) => {
            const dateEndString = dayjs(
              (item.dateEnd?.seconds ?? 0) * 1000
            ).format("DD-MM-YYYY");
            return (
              <SwipeAction
                key={item.id}
                leftActions={
                  item.status === FoodItemStatus.EATEN
                    ? []
                    : [
                        {
                          key: "EAT",
                          text: "Eat",
                          onClick: async () => {
                            const id = dataSource.findIndex(
                              (foodItem) => foodItem?.id === item.id
                            );
                            const itemUpdate = {
                              ...dataSource[id],
                              status: FoodItemStatus.EATEN.toString(),
                            };
                            const list = dataSource.filter(
                              (foodItem) => foodItem?.id !== item.id
                            );
                            list.splice(id, 0, itemUpdate);
                            setDataSource(list);
                            Toast.show({
                              icon: "success",
                              content: "Eating",
                            });
                          },
                          color: "success",
                        },
                      ]
                }
                rightActions={[
                  {
                    key: "UPDATE",
                    text: "Update",
                    onClick: (e) => {
                      setIsUpdatingFoodItem(true);
                      setFoodItemUpdate(
                        dataSource.find(
                          (foodItem) => foodItem?.id === item.id
                        ) ?? null
                      );
                    },
                    color: "light",
                  },
                  {
                    key: "DELETE",
                    text: "Delete",
                    onClick: (e) => {
                      const deleteDialog = Dialog.show({
                        header: "Confirm delete this?",
                        closeOnAction: false,
                        actions: [
                          [
                            {
                              key: "cancel",
                              text: "Cancel",
                              onClick: () => {
                                deleteDialog.close();
                              },
                            },
                            {
                              key: "delete",
                              text: "Delete",
                              bold: true,
                              danger: true,
                              onClick: async () => {
                                setDataSource(
                                  dataSource.filter(
                                    (foodItem) => foodItem.id !== item.id
                                  )
                                );
                                deleteDialog.close();
                                Toast.show({
                                  icon: "success",
                                  content: "Deleted",
                                });
                              },
                            },
                          ],
                        ],

                        content: `${item.name} - ${item?.location?.name}`,
                      });
                    },
                    color: "danger",
                  },
                ]}
                onAction={(action, e) => {}}
              >
                <List.Item
                  key={item.id}
                  description={dateEndString}
                  prefix={<GiftOutline />}
                >
                  <span className="text-sm font-bold text-gray-500">
                    {item?.location?.name}
                  </span>
                  <br />
                  <span
                    className={item.status === "EATEN" ? "line-through" : ""}
                  >
                    {item?.name}
                  </span>
                </List.Item>
              </SwipeAction>
            );
          })}
        </List>
      </PullToRefresh>
      {/* <InfiniteScroll
        hasMore={hasMore}
        loadMore={async (isRetry: boolean) => {
          return;
        }}
      >
        {hasMore ? (
          <>
            <span>Loading</span>
            <DotLoading />
          </>
        ) : (
          <span>End</span>
        )}
      </InfiniteScroll> */}
    </div>
  );
}
