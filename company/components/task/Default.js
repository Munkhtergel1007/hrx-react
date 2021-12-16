<Card
    style={{
        minWidth: 400,
        display: "block",
        marginRight: 20
    }}
    key={task._id}
    title={
        <Card.Meta
            avatar={
                <img
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        overflow: "hidden",
                        objectFit: "cover"
                    }}
                    src={
                        (
                            (task.owner || {})
                                .user || {}
                        ).avatar?.path
                            ? `${config.get(
                                    "hostMedia"
                                )}${
                                    task?.owner
                                        ?.user
                                        ?.avatar
                                        ?.path
                                }`
                            : "/images/default-avatar.png"
                    }
                    onError={(e) =>
                        (e.target.src =
                            "/images/default-avatar.png")
                    }
                />
            }
            title={task?.title || "-"}
            description={
                task?.description || "-"
            }
        />
    }
    extra={
        (task.employees || []).length > 0 &&
        Object.keys(
            ((task.employees || [])[0] || {})
                .user || {}
        ).length > 0 ? (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {(
                    (
                        (task.employees ||
                            [])[0] || {}
                    ).user || {}
                ).avatar ? (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative"
                        }}
                    >
                        <img
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius:
                                    "50%",
                                overflow:
                                    "hidden",
                                objectFit:
                                    "cover"
                            }}
                            src={
                                (
                                    (
                                        (task.employees ||
                                            [])[0] ||
                                        {}
                                    ).user || {}
                                ).avatar
                                    ? `${config.get(
                                            "hostMedia"
                                        )}${
                                            task
                                                .employees[0]
                                                .user
                                                .avatar
                                                .path
                                        }`
                                    : "/images/default-avatar.png"
                            }
                            onError={(e) =>
                                (e.target.src =
                                    "/images/default-avatar.png")
                            }
                        />
                        {(task.employees || [])
                            .length > 1 ? (
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    backgroundColor:
                                        "rgba(0,0,0,0.8)",
                                    color: "white",
                                    fontWeight:
                                        "bold",
                                    fontSize: 18,
                                    top: 0,
                                    right: "-20px",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius:
                                        "50%",
                                    overflow:
                                        "hidden",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center"
                                }}
                            >
                                {`+${
                                    task
                                        .employees
                                        .length -
                                    1
                                }`}
                            </div>
                        ) : null}
                    </div>
                ) : (
                    `+${task.employees.length}`
                )}
            </div>
        ) : null
    }
    description={task.description}
    actions={[
        <Button
            shape={"circle"}
            key={"edit"}
            icon={<EditOutlined />}
        />,
        <Button
            type={"primary"}
            shape={"circle"}
            key={"finish"}
            icon={<CheckOutlined />}
        />,
        <Button
            danger
            type={"primary"}
            shape={"circle"}
            key={"delete"}
            icon={<DeleteOutlined />}
        />
    ]}
>
    {task.title + " "}
</Card>